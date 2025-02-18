import { z } from "zod";
import {
  AccountId,
  Currency,
  MoneyAmount,
  Timestamp,
} from "@/data/types/types";

export const AccountType = z.enum([
  "debit",
  "savings",
  "credit_card",
  "prepaid_card",
]);
export type AccountType = z.infer<typeof AccountType>;

const BaseAccount = z.object({
  id: AccountId,
  name: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string(),
  type: AccountType,
  currency: Currency,
  balance: MoneyAmount,
  sequence: z.number(),
  createdAt: Timestamp,
  updatedAt: Timestamp,
});

const DebitAccount = BaseAccount.extend({
  type: z.literal("debit"),
  iban: z.string(),
  swift: z.string(),
});

const SavingsAccount = BaseAccount.extend({
  type: z.literal("savings"),
  iban: z.string(),
  swift: z.string(),
});

const CreditCardAccount = BaseAccount.extend({
  type: z.literal("credit_card"),
  creditLimit: MoneyAmount,
});

const PrepaidCardAccount = BaseAccount.extend({
  type: z.literal("prepaid_card"),
  iban: z.string(),
  swift: z.string(),
});

export const Account = z.discriminatedUnion("type", [
  DebitAccount,
  SavingsAccount,
  CreditCardAccount,
  PrepaidCardAccount,
]);
export type Account = z.infer<typeof Account>;
