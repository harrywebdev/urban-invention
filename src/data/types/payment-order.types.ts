import { z } from "zod";
import {
  PaymentOrderId,
  PaymentOrderTransactionId,
  ScenarioId,
  Timestamp,
} from "@/data/types/types";
import {
  PaymentOrderTransaction,
  PaymentOrderTransactionWithBalance,
} from "@/data/types/payment-order-transaction.types";

export const PaymentOrderTriggerOn = z.number().min(1).max(28);
export type PaymentOrderTriggerOn = z.infer<typeof PaymentOrderTriggerOn>;

export const PaymentOrderValidFrom = Timestamp;
export type PaymentOrderValidFrom = z.infer<typeof PaymentOrderValidFrom>;

export const PaymentOrder = z.object({
  id: PaymentOrderId,
  scenarioId: ScenarioId,
  description: z.string().min(1),
  validFrom: PaymentOrderValidFrom,
  triggerOn: PaymentOrderTriggerOn,
  transactions: z.array(PaymentOrderTransactionId),
  createdAt: Timestamp,
  updatedAt: Timestamp,
});
export type PaymentOrder = z.infer<typeof PaymentOrder>;

export const PaymentOrderWithoutTransactions = PaymentOrder.omit({
  transactions: true,
});
export type PaymentOrderWithoutTransactions = z.infer<
  typeof PaymentOrderWithoutTransactions
>;

export type PaymentOrderWithTransactions = PaymentOrderWithoutTransactions & {
  transactions: PaymentOrderTransaction[];
};

export type PaymentOrderWithTransactionsAndBalance =
  PaymentOrderWithoutTransactions & {
    transactions: PaymentOrderTransactionWithBalance[];
  };
