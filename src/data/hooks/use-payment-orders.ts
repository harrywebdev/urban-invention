import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import {
  PaymentOrder,
  PaymentOrderWithTransactions,
} from "@/data/types/payment-order.types";
import { usePaymentOrderTransactions } from "@/data/hooks/use-payment-order-transactions";
import { useMemo } from "react";
import { PaymentOrderTransaction } from "@/data/types/payment-order-transaction.types";

export function usePaymentOrders(): {
  data: PaymentOrderWithTransactions[];
  isLoading: boolean;
} {
  const paymentOrders = useLiveQuery(() =>
    db.paymentOrders.orderBy("triggerOn").toArray(),
  );

  // also get all the transactions for each payment order
  const transactionIds = useMemo(
    () => paymentOrders?.flatMap((po) => po.transactions) ?? [],
    [paymentOrders],
  );
  const { data: transactions, isLoading: isTransactionsLoading } =
    usePaymentOrderTransactions(transactionIds);

  const resultPaymentOrders: PaymentOrderWithTransactions[] = useMemo(
    () =>
      (paymentOrders ?? []).map((po: PaymentOrder) => ({
        ...po,
        transactions: (transactions ?? []).filter(
          (t) => t && t.paymentOrderId === po.id,
        ) as PaymentOrderTransaction[],
      })),
    [paymentOrders, transactions],
  );

  return {
    data: resultPaymentOrders,
    isLoading: paymentOrders === undefined || isTransactionsLoading,
  };
}
