import { z } from "zod";
import {
  PaymentOrderId,
  PaymentOrderTransactionId,
  Timestamp,
} from "@/data/types/types";
import {
  PaymentOrderTransaction,
  PaymentOrderTransactionWithBalance,
} from "@/data/types/payment-order-transaction.types";

export const PaymentOrder = z.object({
  id: PaymentOrderId,
  description: z.string().min(1),
  validFrom: Timestamp,
  triggerOn: z.number().min(1).max(28),
  transactions: z.array(PaymentOrderTransactionId),
  createdAt: Timestamp,
  updatedAt: Timestamp,
});
export type PaymentOrder = z.infer<typeof PaymentOrder>;

export type PaymentOrderWithTransactions = Omit<
  PaymentOrder,
  "transactions"
> & {
  transactions: PaymentOrderTransaction[];
};

export type PaymentOrderWithTransactionsAndBalance = Omit<
  PaymentOrder,
  "transactions"
> & {
  transactions: PaymentOrderTransactionWithBalance[];
};
