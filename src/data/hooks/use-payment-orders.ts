import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import {
  PaymentOrder,
  PaymentOrderWithoutTransactions,
  PaymentOrderWithTransactions,
} from "@/data/types/payment-order.types";
import { usePaymentOrderTransactions } from "@/data/hooks/use-payment-order-transactions";
import { useMemo } from "react";
import { PaymentOrderTransaction } from "@/data/types/payment-order-transaction.types";
import { useScenario } from "@/contexts/ScenarioContext";
import { PaymentOrderId } from "@/data/types/types";
import { debug } from "@/lib/debug";

export function usePaymentOrders(): {
  data: PaymentOrderWithTransactions[];
  isLoading: boolean;
} {
  const { currentScenarioId } = useScenario();

  const paymentOrders = useLiveQuery(
    async () =>
      currentScenarioId
        ? await db.paymentOrders
            .where({ scenarioId: currentScenarioId })
            .sortBy("triggerOn")
        : [],
    [currentScenarioId],
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

export const createPaymentOrder = async (
  data: PaymentOrder,
  transactions: PaymentOrderTransaction[],
) =>
  db.transaction(
    "rw",
    db.paymentOrders,
    db.paymentOrderTransactions,
    async () => {
      debug("createPaymentOrder", { data, transactions });

      // store the PO
      await db.paymentOrders.add(data);

      // store it's transactions
      await db.paymentOrderTransactions.bulkAdd(transactions);
    },
  );

export const deletePaymentOrder = async (id: PaymentOrderId) =>
  db.transaction(
    "rw",
    db.paymentOrders,
    db.paymentOrderTransactions,
    async () => {
      debug("deletePaymentOrder", id);
      await db.paymentOrders.delete(id);
      await db.paymentOrderTransactions.where({ paymentOrderId: id }).delete();
    },
  );

// on purpose without transactions, as those can change their PO on their own
export const updatePaymentOrder = async (
  data: PaymentOrderWithoutTransactions,
) => {
  debug("updatePaymentOrder", data);
  return db.paymentOrders.update(data.id, data);
};
