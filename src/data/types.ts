import { z } from "zod";

export const Currency = z.enum(["USD", "EUR", "CZK"]);
export type Currency = z.infer<typeof Currency>;

export const MoneyAmount = z.number().min(0);
export type MoneyAmount = z.infer<typeof MoneyAmount>;

const Timestamp = z.date();
type Timestamp = z.infer<typeof Timestamp>;

const AccountId = z.string().uuid();
type AccountId = z.infer<typeof AccountId>;

const TransactionId = z.string().uuid();
type TransactionId = z.infer<typeof TransactionId>;

export const AccountType = z.enum(["debit", "savings", "credit_card"]);
export type AccountType = z.infer<typeof AccountType>;

const BaseAccount = z.object({
  id: AccountId,
  name: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string(),
  type: AccountType,
  currency: Currency,
  balance: MoneyAmount,
  transactions: z.array(TransactionId),
});
type BaseAccount = z.infer<typeof BaseAccount>;

const DebitAccount = BaseAccount.extend({
  type: z.literal("debit"),
});
type DebitAccount = z.infer<typeof DebitAccount>;

const SavingsAccount = BaseAccount.extend({
  type: z.literal("savings"),
});
type SavingsAccount = z.infer<typeof SavingsAccount>;

const CreditCardAccount = BaseAccount.extend({
  type: z.literal("credit_card"),
  creditLimit: MoneyAmount,
});
type CreditCardAccount = z.infer<typeof CreditCardAccount>;

export const Account = z.discriminatedUnion("type", [
  DebitAccount,
  SavingsAccount,
  CreditCardAccount,
]);
export type Account = z.infer<typeof Account>;

const TransactionType = z.enum(["income", "expense", "transfer"]);
type TransactionType = z.infer<typeof TransactionType>;

const BaseTransaction = z.object({
  id: TransactionId,
  date: Timestamp,
  currency: Currency,
  amount: MoneyAmount,
  description: z.string(),
});
type BaseTransaction = z.infer<typeof BaseTransaction>;

const IncomeTransaction = BaseTransaction.extend({
  type: z.literal("income"),
  toAccount: AccountId,
});
type IncomeTransaction = z.infer<typeof IncomeTransaction>;

const ExpenseTransaction = BaseTransaction.extend({
  type: z.literal("expense"),
  fromAccount: AccountId,
});
type ExpenseTransaction = z.infer<typeof ExpenseTransaction>;

const TransferTransaction = BaseTransaction.extend({
  type: z.literal("transfer"),
  fromAccount: AccountId,
  toAccount: AccountId,
});
type TransferTransaction = z.infer<typeof TransferTransaction>;

export const Transaction = z.discriminatedUnion("type", [
  IncomeTransaction,
  ExpenseTransaction,
  TransferTransaction,
]);
export type Transaction = z.infer<typeof Transaction>;
