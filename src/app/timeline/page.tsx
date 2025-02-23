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
import { Button } from "@/components/ui/button";
import { useScenario } from "@/contexts/ScenarioContext";
import { useCurrentScenario } from "@/data/hooks/use-scenarios";
import Loader from "@/components/Loader";

export default function Timeline() {
  const { setCurrentScenarioId } = useScenario();
  const currentScenario = useCurrentScenario();

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
    console.log(`data`, data);

    // TODO: run through all scenario POs, get the transactions, ignore the transfer,
    //  calculate the monthly delta, and plot it on the chart
    //  don't forget to incldue the POs "validFrom" when calculating whether the PO is active
  };

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Projekce</PageHeaderTitle>
      </PageHeader>

      {!currentScenario ? (
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

                <h2 className="text-lg font-semibold">Transakce</h2>
                {/*  TODO: list all relevant txs (income, expense only) with checkboxes*/}
              </form>
            </Form>
          </div>

          <div>
            chart
            {/*    chart*/}
          </div>
        </div>
      )}
    </>
  );
}
