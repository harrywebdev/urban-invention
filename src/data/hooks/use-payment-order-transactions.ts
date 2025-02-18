import { AccountId, PaymentOrderTransactionId } from "@/data/types/types";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import {
  isPaymentOrderTransactionWithFromAccount,
  isPaymentOrderTransactionWithToAccount,
  PaymentOrderTransaction,
} from "@/data/types/payment-order-transaction.types";
import { useMemo } from "react";

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
