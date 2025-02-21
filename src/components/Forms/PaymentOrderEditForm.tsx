"use client";

import { FC, ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentOrderEditFormSchema,
  PaymentOrderEditFormValues,
} from "@/data/forms/payment-order.form";
import FormErrorMessage from "@/components/FormFields/FormErrorMessage";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PaymentOrderWithoutTransactions } from "@/data/types/payment-order.types";

type PaymentOrderEditFormProps = {
  children: (form: ReactNode, isSubmitting: boolean) => ReactNode;
  paymentOrder: PaymentOrderWithoutTransactions;
  handleSubmit: (data: PaymentOrderWithoutTransactions) => Promise<void>;
};

const PaymentOrderEditForm: FC<PaymentOrderEditFormProps> = ({
  children,
  paymentOrder,
  handleSubmit,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PaymentOrderEditFormValues>({
    resolver: zodResolver(PaymentOrderEditFormSchema),
    defaultValues: {
      description: paymentOrder.description,
      validFrom: paymentOrder.validFrom.toJSON().slice(0, 10),
      triggerOn: paymentOrder.triggerOn,
    },
  });

  const onSubmit = async (data: PaymentOrderEditFormValues) => {
    setIsSubmitting(true);
    const enhancedData = {
      ...data,
      id: paymentOrder.id,
      scenarioId: paymentOrder.scenarioId,
      // transactions are missing on purpose so they don't get updated
      createdAt: paymentOrder.createdAt,
      updatedAt: new Date(),
    };

    const validatedData =
      PaymentOrderWithoutTransactions.safeParse(enhancedData);

    if (!validatedData.success) {
      setErrorMessage(validatedData.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      await handleSubmit(validatedData.data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Neznámá chyba");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className="container space-y-6">
      <FormErrorMessage errorMessage={errorMessage} />

      <div className={"space-y-4 py-5 px-6 bg-neutral-50 rounded-md"}>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popis</FormLabel>

              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className={"grid grid-cols-[2fr_1fr] gap-4 w-full"}>
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platný od</FormLabel>

                <FormControl>
                  <Input type={"date"} placeholder="12345678" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="triggerOn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Den v měsíci</FormLabel>

                <FormControl>
                  <Input
                    type={"number"}
                    step={1}
                    placeholder="2"
                    {...field}
                    onChange={(value) =>
                      field.onChange(
                        isNaN(value.target.valueAsNumber)
                          ? ""
                          : value.target.valueAsNumber,
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children(formContent, isSubmitting)}
      </form>
    </FormProvider>
  );
};

export default PaymentOrderEditForm;
