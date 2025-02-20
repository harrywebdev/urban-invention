import { FC } from "react";
import { PaymentOrderTransaction } from "@/data/types/payment-order-transaction.types";
import { transactionVariants } from "@/components/ui/transaction";
import { formatTransactionMoney } from "@/lib/utils";

type PaymentOrdersTotalsProps = {
  transactions: PaymentOrderTransaction[];
};

type Totals = {
  income: number;
  expense: number;
};

const PaymentOrdersTotals: FC<PaymentOrdersTotalsProps> = ({
  transactions,
}) => {
  // summarize all income, expense and transfer transactions
  const totals: Totals = (transactions ?? []).reduce(
    (acc, tx) => {
      // TODO: add currency/conversion
      if (tx?.currency !== "CZK") {
        return acc;
      }

      return {
        income: acc.income + (tx && tx.type === "income" ? tx.amount : 0),
        expense: acc.expense + (tx && tx.type === "expense" ? tx.amount : 0),
      };
    },
    { income: 0, expense: 0 },
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
    </div>
  );
};

export default PaymentOrdersTotals;
