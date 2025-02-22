import { AccountId, PaymentOrderTransactionId } from "@/data/types/types";
import { useLiveQuery } from "dexie-react-hooks";
import { client } from "@/data/db/client";
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
    () => client.paymentOrderTransactions.bulkGet(transactionIds),
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
  client.transaction(
    "rw",
    client.paymentOrders,
    client.paymentOrderTransactions,
    async () => {
      debug("updatePaymentOrderTransaction", data);

      // if the payment order ID changed, we need to remove it from the original and add it to the new one
      const originalTransaction = await client.paymentOrderTransactions.get(
        data.id,
      );

      // guards
      invariant(
        originalTransaction,
        `PaymentOrderTransaction with ID ${data.id} not found`,
      );

      if (originalTransaction.paymentOrderId !== data.paymentOrderId) {
        const originalPaymentOrder = await client.paymentOrders.get(
          originalTransaction.paymentOrderId,
        );
        const newPaymentOrder = await client.paymentOrders.get(
          data.paymentOrderId,
        );

        invariant(
          originalPaymentOrder,
          `PaymentOrder with ID ${originalTransaction.paymentOrderId} not found`,
        );
        invariant(
          newPaymentOrder,
          `PaymentOrder with ID ${data.paymentOrderId} not found`,
        );

        await client.paymentOrders.update(originalPaymentOrder.id, {
          transactions: originalPaymentOrder.transactions.filter(
            (id) => id !== data.id,
          ),
        });

        await client.paymentOrders.update(newPaymentOrder.id, {
          transactions: [...newPaymentOrder.transactions, data.id],
        });
      }

      // update the transaction
      await client.paymentOrderTransactions.put(data);
    },
  );
