import { FC } from "react";
import { transactionVariants } from "@/components/ui/transaction";
import { formatTransactionMoney } from "@/lib/utils";
import { MoneyAmount } from "@/data/types/types";
import { Separator } from "@/components/ui/separator";
import { Transaction } from "@/data/types/transaction.types";

type ProjectionTotalsProps = {
  transactions: Transaction[];
  accountsBalance: MoneyAmount;
};

type Totals = {
  income: number;
  expense: number;
  balance: number;
};

const ProjectionTotals: FC<ProjectionTotalsProps> = ({
  transactions,
  accountsBalance,
}) => {
  // summarize all income, expense and transfer transactions
  const totals: Totals = (transactions ?? []).reduce(
    (acc, tx) => {
      // TODO: add currency/conversion
      if (tx?.currency !== "CZK") {
        return acc;
      }

      const income = tx.type === "income" ? tx.amount : 0;
      const expense = tx.type === "expense" ? tx.amount : 0;

      return {
        income: acc.income + income,
        expense: acc.expense + expense,
        balance: acc.balance + income - expense,
      };
    },
    { income: 0, expense: 0, balance: accountsBalance },
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>Suma příjmů:</div>

      <div className={"text-right"}>
        <span className={`${transactionVariants({ variant: "income" })}`}>
          {formatTransactionMoney(totals.income, "CZK", "income")}
        </span>
      </div>

      <div>Suma výdajů:</div>

      <div className={"text-right"}>
        <span className={`${transactionVariants({ variant: "expense" })}`}>
          {formatTransactionMoney(totals.expense, "CZK", "expense")}
        </span>
      </div>

      <Separator />
      <Separator />

      <div>Počáteční stav účtů:</div>

      <div className={"text-right"}>
        <span className={`${transactionVariants({ variant: "transfer" })}`}>
          {formatTransactionMoney(
            accountsBalance,
            "CZK",
            accountsBalance > 0 ? "income" : "expense",
          )}
        </span>
      </div>

      <div>Koncový stav účtů:</div>

      <div className={"text-right"}>
        <span
          className={`${transactionVariants({ variant: totals.balance > 0 ? "income" : "expense" })}`}
        >
          {formatTransactionMoney(
            totals.balance,
            "CZK",
            totals.balance > 0 ? "income" : "expense",
          )}
        </span>
      </div>
    </div>
  );
};

export default ProjectionTotals;
