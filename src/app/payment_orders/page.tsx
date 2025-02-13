"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import { PlusCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import PaymentOrderTransactionsList from "@/components/Transactions/PaymentOrderTransactionsList";
import { useMemo } from "react";
import { PaymentOrderTransaction } from "@/data/payment-order-transaction.types";
import { formatTransactionMoney } from "@/lib/utils";
import { transactionVariants } from "@/components/ui/transaction";

type Totals = {
  income: number;
  expense: number;
};

export default function Home() {
  const paymentOrders = useLiveQuery(() =>
    db.paymentOrders.orderBy("triggerOn").toArray(),
  );

  // also get all the transactions for each payment order
  const transactionIds = useMemo(
    () => paymentOrders?.flatMap((po) => po.transactions) ?? [],
    [paymentOrders],
  );
  const transactions = useLiveQuery(
    () => db.paymentOrderTransactions.bulkGet(transactionIds),
    [transactionIds],
  );

  const presentedPaymentOrders = useMemo(() => {
    return paymentOrders?.map((po) => ({
      ...po,
      transactions: (transactions ?? []).filter(
        (t) => t && t.paymentOrderId === po.id,
      ) as PaymentOrderTransaction[],
    }));
  }, [paymentOrders, transactions]);

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
    <>
      <PageHeader>
        <PageHeaderTitle>Platební příkazy</PageHeaderTitle>

        <Link
          className={buttonVariants({ variant: "link" })}
          href="/payment_orders/add"
        >
          <PlusCircle className="h-4 w-4" />
          Přidat příkaz
        </Link>
      </PageHeader>

      <div>
        <div className="flex justify-between px-2">
          <div className={"font-semibold"}>
            Suma příjmů:{" "}
            <span className={`${transactionVariants({ variant: "income" })}`}>
              {formatTransactionMoney(totals.income, "CZK", "income")}
            </span>
          </div>

          <div className={"font-semibold"}>
            Suma výdajů:{" "}
            <span className={`${transactionVariants({ variant: "expense" })}`}>
              {formatTransactionMoney(totals.expense, "CZK", "expense")}
            </span>
          </div>
        </div>
      </div>

      {presentedPaymentOrders?.length ? (
        <div className="space-y-6">
          {presentedPaymentOrders.map((paymentOrder) => (
            <div key={paymentOrder.id} className="border rounded-md">
              <div className={"bg-neutral-50 p-4 border-b"}>
                {paymentOrder.triggerOn}. den: {paymentOrder.description}
              </div>

              <PaymentOrderTransactionsList
                transactions={paymentOrder.transactions}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}
