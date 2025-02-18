import { z } from "zod";

export const Currency = z.enum(["USD", "EUR", "CZK"]);
export type Currency = z.infer<typeof Currency>;

export const MoneyAmount = z.number();
export type MoneyAmount = z.infer<typeof MoneyAmount>;

export const Timestamp = z.coerce.date();
export type Timestamp = z.infer<typeof Timestamp>;

export const AccountId = z.string().uuid("Účet je povinný");
export type AccountId = z.infer<typeof AccountId>;

export const TransactionId = z.string().uuid();
export type TransactionId = z.infer<typeof TransactionId>;

export const PaymentOrderTransactionId = z.string().uuid();
export type PaymentOrderTransactionId = z.infer<
  typeof PaymentOrderTransactionId
>;

export const PaymentOrderId = z.string().uuid();
export type PaymentOrderId = z.infer<typeof PaymentOrderId>;
