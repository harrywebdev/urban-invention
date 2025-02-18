import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency, MoneyAmount } from "@/data/types/types";
import { Account } from "@/data/types/account.types";
import { TransactionType } from "@/data/types/transaction.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: MoneyAmount, currency: Currency) {
  // use Intl.NumberFormat to format the money
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatCurrency(currency: Currency) {
  const currencyFormatter = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const parts = currencyFormatter.formatToParts(0);

  return parts.find((part) => part.type === "currency")?.value ?? "";
}

export function formatTransactionMoney(
  amount: MoneyAmount,
  currency: Currency,
  type: TransactionType,
) {
  // use Intl.NumberFormat to format the money
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: currency,
    signDisplay: type === TransactionType.enum.transfer ? "never" : "always",
  }).format(type === TransactionType.enum.expense ? -amount : amount);
}

export function formatAccountNumber(account?: Account) {
  if (!account || account.routingNumber === "0000") {
    return "-";
  }

  return `${account.accountNumber}/${account.routingNumber}`;
}
