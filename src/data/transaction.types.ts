import { z } from "zod";
import {
  AccountId,
  Currency,
  MoneyAmount,
  Timestamp,
  TransactionId,
} from "@/data/types";

export const BaseTransaction = z.object({
  id: TransactionId,
  date: Timestamp,
  currency: Currency,
  amount: MoneyAmount,
  description: z.string(),
  createdAt: Timestamp,
  updatedAt: Timestamp,
});

export const TransactionType = z.enum(["income", "expense", "transfer"]);
export type TransactionType = z.infer<typeof TransactionType>;

export const IncomeTransaction = z.object({
  type: z.literal("income"),
  toAccount: AccountId,
});

export const ExpenseTransaction = z.object({
  type: z.literal("expense"),
  fromAccount: AccountId,
});

export const TransferTransaction = z.object({
  type: z.literal("transfer"),
  fromAccount: AccountId,
  toAccount: AccountId,
});

export const Transaction = z.discriminatedUnion("type", [
  BaseTransaction.merge(IncomeTransaction),
  BaseTransaction.merge(ExpenseTransaction),
  BaseTransaction.merge(TransferTransaction),
]);
export type Transaction = z.infer<typeof Transaction>;
