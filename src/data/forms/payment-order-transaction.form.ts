import * as z from "zod";
import { Currency, MoneyAmount, PaymentOrderId } from "@/data/types/types";
import {
  ExpenseTransaction,
  IncomeTransaction,
  TransferTransaction,
} from "@/data/types/transaction.types";

const BasePaymentOrderTransactionFormSchema = z.object({
  paymentOrderId: PaymentOrderId,
  currency: Currency,
  amount: MoneyAmount.min(1, "Chybí částka"),
  description: z.string().min(1, "Chybí popis"),
});
export const PaymentOrderTransactionFormSchema = z.discriminatedUnion("type", [
  BasePaymentOrderTransactionFormSchema.merge(IncomeTransaction),
  BasePaymentOrderTransactionFormSchema.merge(ExpenseTransaction),
  BasePaymentOrderTransactionFormSchema.merge(TransferTransaction),
]);
export type PaymentOrderTransactionFormValues = z.infer<
  typeof PaymentOrderTransactionFormSchema
>;
