import { z } from "zod";
import {
  AccountId,
  MoneyAmount,
  PaymentOrderId,
  PaymentOrderTransactionId,
} from "@/data/types/types";
import {
  BaseTransaction,
  ExpenseTransaction,
  IncomeTransaction,
  TransactionType,
  TransferTransaction,
} from "@/data/types/transaction.types";

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

export const PaymentOrderTransactionWithBalance = z.discriminatedUnion("type", [
  BasePaymentOrderTransaction.extend({ balance: MoneyAmount }).merge(
    IncomeTransaction,
  ),
  BasePaymentOrderTransaction.extend({ balance: MoneyAmount }).merge(
    ExpenseTransaction,
  ),
  BasePaymentOrderTransaction.extend({ balance: MoneyAmount }).merge(
    TransferTransaction,
  ),
]);
export type PaymentOrderTransactionWithBalance = z.infer<
  typeof PaymentOrderTransactionWithBalance
>;

export function isPaymentOrderTransactionWithFromAccount(
  tx: PaymentOrderTransaction,
): tx is ExpensePaymentOrderTransaction | TransferPaymentOrderTransaction {
  return tx.type === "expense" || tx.type === "transfer";
}

export function isPaymentOrderTransactionWithToAccount(
  tx: PaymentOrderTransaction,
): tx is IncomePaymentOrderTransaction | TransferPaymentOrderTransaction {
  return tx.type === "income" || tx.type === "transfer";
}

export function forcePaymentOrderTransactionTypeWithoutTransfer(
  transaction: PaymentOrderTransaction,
  accountId: AccountId,
) {
  if (transaction.type === TransactionType.enum.transfer) {
    return transaction.fromAccount === accountId
      ? TransactionType.enum.expense
      : TransactionType.enum.income;
  }

  return transaction.type;
}
