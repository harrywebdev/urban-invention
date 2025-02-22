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

export default function Timeline() {
  const form = useForm({
    resolver: zodResolver(TimelineFormSchema),
    defaultValues: {
      startsFrom: new Date().toJSON().slice(0, 10),
      endsAt: new Date().toJSON().slice(0, 10),
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

      <div className="grid grid-cols-[1fr_3fr] gap-8">
        <div className={"flex flex-col gap-4"}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
    </>
  );
}
