import { useLiveQuery } from "dexie-react-hooks";
import { client } from "@/data/db/client";
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
        ? await client.paymentOrders
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
  client.transaction(
    "rw",
    client.paymentOrders,
    client.paymentOrderTransactions,
    async () => {
      debug("createPaymentOrder", { data, transactions });

      // store the PO
      await client.paymentOrders.add(data);

      // store it's transactions
      await client.paymentOrderTransactions.bulkAdd(transactions);
    },
  );

export const deletePaymentOrder = async (id: PaymentOrderId) =>
  client.transaction(
    "rw",
    client.paymentOrders,
    client.paymentOrderTransactions,
    async () => {
      debug("deletePaymentOrder", id);
      await client.paymentOrders.delete(id);
      await client.paymentOrderTransactions
        .where({ paymentOrderId: id })
        .delete();
    },
  );

// on purpose without transactions, as those can change their PO on their own
export const updatePaymentOrder = async (
  data: PaymentOrderWithoutTransactions,
) => {
  debug("updatePaymentOrder", data);
  return client.paymentOrders.update(data.id, data);
};
