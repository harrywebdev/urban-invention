"use client";

import { Columns3Icon, ListIcon, TableIcon } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PaymentOrderIndexPageHeader } from "@/components/PaymentOrders/PaymentOrderPageHeaders";
import PaymentOrdersListView from "@/components/PaymentOrders/PaymentOrdersListView";
import { usePaymentOrders } from "@/data/hooks/use-payment-orders";
import PaymentOrdersTotals from "@/components/PaymentOrders/PaymentOrdersTotals";
import Loader from "@/components/Loader";
import PaymentOrdersColumnsView from "@/components/PaymentOrders/PaymentOrdersColumnsView";
import PaymentOrdersTableView from "@/components/PaymentOrders/PaymentOrdersTableView";

export default function Home() {
  const { data: paymentOrders, isLoading } = usePaymentOrders();

  const [presentingView, setPresentingView] = useState<
    "list" | "accountColumns" | "table"
  >("table");

  const transactions = paymentOrders.flatMap((po) => po.transactions);

  return (
    <>
      <PaymentOrderIndexPageHeader />

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={"flex flex-col gap-4 items-start"}>
            <PaymentOrdersTotals transactions={transactions} />

            <div className={"border rounded-md flex items-center gap-1 p-1"}>
              <ToggleGroup
                type="single"
                value={presentingView}
                defaultValue={presentingView}
                onValueChange={(value: "list" | "accountColumns") =>
                  value ? setPresentingView(value) : null
                }
              >
                <ToggleGroupItem value="list" aria-label="Seznam">
                  <ListIcon className="h-4 w-4" />
                </ToggleGroupItem>

                <ToggleGroupItem value="accountColumns" aria-label="Kolonky">
                  <Columns3Icon className="h-4 w-4" />
                </ToggleGroupItem>

                <ToggleGroupItem value="table" aria-label="Tabulka">
                  <TableIcon className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {presentingView === "list" ? (
            <PaymentOrdersListView paymentOrders={paymentOrders} />
          ) : null}

          {presentingView === "accountColumns" ? (
            <PaymentOrdersColumnsView paymentOrders={paymentOrders} />
          ) : null}

          {presentingView === "table" ? (
            <PaymentOrdersTableView paymentOrders={paymentOrders} />
          ) : null}
        </>
      )}
    </>
  );
}
