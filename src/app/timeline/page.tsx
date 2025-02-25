"use client";

import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AmountFormField from "@/components/FormFields/AmountFormField";
import {
  TimelineFormSchema,
  TimelineFormValues,
} from "@/data/forms/timeline.form";
import { Button, SubmitButton } from "@/components/ui/button";
import { useScenario } from "@/contexts/ScenarioContext";
import { useCurrentScenario } from "@/data/hooks/use-scenarios";
import Loader from "@/components/Loader";
import { usePaymentOrders } from "@/data/hooks/use-payment-orders";
import invariant from "tiny-invariant";
import { useState } from "react";
import ProjectionTotals from "@/components/Projection/ProjectionTotals";
import ProjectionTotalsChart from "@/components/Projection/ProjectionTotalsChart";
import { Transaction } from "@/data/types/transaction.types";

export default function Timeline() {
  const { setCurrentScenarioId } = useScenario();
  const currentScenario = useCurrentScenario();
  const { data: paymentOrders, isLoading: isPaymentOrdersLoading } =
    usePaymentOrders();

  const [projectionTransactions, setProjectionTransactions] = useState<
    Transaction[]
  >([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [projectionData, setProjectionData] = useState<TimelineFormValues>();

  // ends at by default as now + 1 year
  const defaultEndsAt = new Date();
  defaultEndsAt.setFullYear(defaultEndsAt.getFullYear() + 1);

  const form = useForm({
    resolver: zodResolver(TimelineFormSchema),
    defaultValues: {
      startsFrom: new Date().toJSON().slice(0, 10),
      endsAt: defaultEndsAt.toJSON().slice(0, 10),
      accountBalance: 0,
    },
  });

  const onSubmit = async (data: TimelineFormValues) => {
    invariant(paymentOrders, "Payment orders are not loaded");
    console.log(`data`, data);

    setProjectionData(data);

    // get how many months there are between data.startsFrom and data.endsAt
    const startsFrom = new Date(data.startsFrom);
    const endsAt = new Date(data.endsAt);
    const months =
      (endsAt.getFullYear() - startsFrom.getFullYear()) * 12 +
      (endsAt.getMonth() - startsFrom.getMonth());

    // TODO: do not forget to include the POs "validFrom" when calculating whether the PO is active
    const onlyIncomeOrExpenseTransactions: Transaction[] =
      paymentOrders.flatMap((po) =>
        po.transactions
          .filter((t) => t.type === "income" || t.type === "expense")
          .map((t) => {
            // create tx date from the starting date and a day of PO's `triggerOn`
            const date = new Date(startsFrom);
            date.setDate(po.triggerOn);

            return {
              ...t,
              date,
            };
          }),
      );

    const transactionsForProjection = Array.from({ length: months }, (_, i) =>
      onlyIncomeOrExpenseTransactions.map((tx) => {
        // take existing date but modify the month with current index
        const thisMonthDate = new Date(tx.date);
        thisMonthDate.setMonth(thisMonthDate.getMonth() + i);

        console.log(`thisMonthDate`, thisMonthDate);

        return {
          ...tx,
          date: thisMonthDate,
        };
      }),
    ).flatMap((txs) => txs);

    setProjectionTransactions(transactionsForProjection);

    setHasSubmitted(true);
  };

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Projekce</PageHeaderTitle>
      </PageHeader>

      {isPaymentOrdersLoading || !currentScenario ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] md:grid-cols-[1fr_2fr] gap-8">
          <div className={"flex flex-col gap-4"}>
            <div
              className={
                "p-3 rounded-md bg-neutral-100 gap-2 flex flex-col sm:items-start md:items-stretch"
              }
            >
              <div
                className={
                  "flex flex-col justify-start items-baseline gap-2 text-md"
                }
              >
                <h3 className="font-semibold">Scénář:</h3>

                <div>{currentScenario.name}</div>
              </div>

              <Button
                variant={"outline"}
                size={"sm"}
                className={"h-7 text-xs"}
                onClick={() => setCurrentScenarioId(null)}
              >
                Změnit scénář
              </Button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="startsFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Od</FormLabel>

                      <FormControl>
                        <Input type={"date"} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do</FormLabel>

                      <FormControl>
                        <Input type={"date"} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AmountFormField
                  control={form.control}
                  name={"accountBalance"}
                  label={"Počáteční stav"}
                  currency={"CZK"}
                />

                <SubmitButton>Spustit</SubmitButton>

                {/*<h2 className="text-lg font-semibold">Transakce</h2>*/}
                {/*  TODO: list all relevant txs (income, expense only) with checkboxes*/}
              </form>
            </Form>
          </div>

          {hasSubmitted && projectionData ? (
            <div>
              <div
                className={
                  "p-3 rounded-md bg-neutral-100 text-md font-semibold w-full"
                }
              >
                <ProjectionTotals
                  transactions={projectionTransactions}
                  accountsBalance={projectionData.accountBalance}
                />
              </div>

              <div className={"py-4"}>
                <ProjectionTotalsChart
                  transactions={projectionTransactions}
                  accountsBalance={projectionData.accountBalance}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
