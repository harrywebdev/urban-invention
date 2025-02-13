import { z } from "zod";
import { PaymentOrderId, PaymentOrderTransactionId } from "@/data/types";
import {
  BaseTransaction,
  ExpenseTransaction,
  IncomeTransaction,
  TransferTransaction,
} from "@/data/transaction.types";

const BasePaymentOrderTransaction = BaseTransaction.omit({ date: true }).extend(
  {
    id: PaymentOrderTransactionId,
    paymentOrderId: PaymentOrderId,
  },
);

const IncomePaymentOrderTransaction =
  BasePaymentOrderTransaction.merge(IncomeTransaction);
type IncomePaymentOrderTransaction = z.infer<
  typeof IncomePaymentOrderTransaction
>;

const ExpensePaymentOrderTransaction =
  BasePaymentOrderTransaction.merge(ExpenseTransaction);
type ExpensePaymentOrderTransaction = z.infer<
  typeof ExpensePaymentOrderTransaction
>;

const TransferPaymentOrderTransaction =
  BasePaymentOrderTransaction.merge(TransferTransaction);
type TransferPaymentOrderTransaction = z.infer<
  typeof TransferPaymentOrderTransaction
>;

export const PaymentOrderTransaction = z.discriminatedUnion("type", [
  IncomePaymentOrderTransaction,
  ExpensePaymentOrderTransaction,
  TransferPaymentOrderTransaction,
]);
export type PaymentOrderTransaction = z.infer<typeof PaymentOrderTransaction>;

export function isPaymentOrderTransactionWithFromAccount(
  tx: PaymentOrderTransaction,
): tx is ExpensePaymentOrderTransaction | TransferPaymentOrderTransaction {
  return tx.type === "expense" || tx.type === "transfer";
}
