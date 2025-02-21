import { AccountId, PaymentOrderTransactionId } from "@/data/types/types";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import {
  isPaymentOrderTransactionWithFromAccount,
  isPaymentOrderTransactionWithToAccount,
  PaymentOrderTransaction,
} from "@/data/types/payment-order-transaction.types";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { debug } from "@/lib/debug";

export function usePaymentOrderTransactions(
  transactionIds: PaymentOrderTransactionId[],
): {
  data: PaymentOrderTransaction[];
  isLoading: boolean;
} {
  const transactions = useLiveQuery(
    () => db.paymentOrderTransactions.bulkGet(transactionIds),
    [transactionIds],
  );

  const onlyFoundTransactions: PaymentOrderTransaction[] = useMemo(
    () => (transactions?.filter(Boolean) ?? []) as PaymentOrderTransaction[],
    [transactions],
  );

  return {
    data: onlyFoundTransactions,
    isLoading: transactions === undefined,
  };
}

export const filterPaymentOrderTransactionsByAccountId =
  (accountId: AccountId) =>
  (transactions: PaymentOrderTransaction[]): PaymentOrderTransaction[] =>
    transactions.filter((tx) => {
      if (
        isPaymentOrderTransactionWithFromAccount(tx) &&
        tx.fromAccount === accountId
      ) {
        return true;
      }

      return (
        isPaymentOrderTransactionWithToAccount(tx) && tx.toAccount === accountId
      );
    });

export const updatePaymentOrderTransaction = (data: PaymentOrderTransaction) =>
  db.transaction(
    "rw",
    db.paymentOrders,
    db.paymentOrderTransactions,
    async () => {
      debug("updatePaymentOrderTransaction", data);

      // if the payment order ID changed, we need to remove it from the original and add it to the new one
      const originalTransaction = await db.paymentOrderTransactions.get(
        data.id,
      );

      // guards
      invariant(
        originalTransaction,
        `PaymentOrderTransaction with ID ${data.id} not found`,
      );

      if (originalTransaction.paymentOrderId !== data.paymentOrderId) {
        const originalPaymentOrder = await db.paymentOrders.get(
          originalTransaction.paymentOrderId,
        );
        const newPaymentOrder = await db.paymentOrders.get(data.paymentOrderId);

        invariant(
          originalPaymentOrder,
          `PaymentOrder with ID ${originalTransaction.paymentOrderId} not found`,
        );
        invariant(
          newPaymentOrder,
          `PaymentOrder with ID ${data.paymentOrderId} not found`,
        );

        await db.paymentOrders.update(originalPaymentOrder.id, {
          transactions: originalPaymentOrder.transactions.filter(
            (id) => id !== data.id,
          ),
        });

        await db.paymentOrders.update(newPaymentOrder.id, {
          transactions: [...newPaymentOrder.transactions, data.id],
        });
      }

      // update the transaction
      await db.paymentOrderTransactions.put(data);
    },
  );
