import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency, MoneyAmount } from "@/data/types";

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
