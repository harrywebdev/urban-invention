import { Transaction } from "@/data/types/transaction.types";
import invariant from "tiny-invariant";

export function calculateTransactionBalance(
  startingBalance: number,
  transactions: Transaction[],
): {
  income: number;
  expense: number;
  balance: number;
} {
  return transactions.reduce(
    (acc, tx) => {
      invariant(tx, "Transaction is not defined");
      invariant(tx.currency === "CZK", "Currency is not CZK");

      const income = tx.type === "income" ? tx.amount : 0;
      const expense = tx.type === "expense" ? tx.amount : 0;

      return {
        income: acc.income + income,
        expense: acc.expense + expense,
        balance: acc.balance + income - expense,
      };
    },
    { income: 0, expense: 0, balance: startingBalance },
  );
}
