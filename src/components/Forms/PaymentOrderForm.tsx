"use client";

import { FC, useRef, useState } from "react";
import FormErrorMessage from "@/components/FormFields/FormErrorMessage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button, SubmitButton } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentOrderTransactionForm from "@/components/Forms/PaymentOrderTransactionForm";
import { PaymentOrderId } from "@/data/types/types";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/data/db";
import { useRouter } from "next/navigation";
import { useDialogStore } from "@/stores/use-dialog.store";
import { v4 as uuidv4 } from "uuid";
import {
  PaymentOrderFormSchema,
  PaymentOrderFormValues,
} from "@/data/forms/payment-order.form";
import { PaymentOrder } from "@/data/types/payment-order.types";
import { PaymentOrderTransaction } from "@/data/types/payment-order-transaction.types";
import PaymentOrderTransactionsList from "@/components/Transactions/PaymentOrderTransactionsList";

type PaymentOrderFormProps = unknown;

const PaymentOrderForm: FC<PaymentOrderFormProps> = () => {
  const router = useRouter();
  const { openDialog, closeDialog } = useDialogStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const paymentOrderId = useRef<PaymentOrderId>(uuidv4());

  const form = useForm<PaymentOrderFormValues>({
    resolver: zodResolver(PaymentOrderFormSchema),
    defaultValues: {
      description: "",
      validFrom: new Date().toJSON().slice(0, 10),
      triggerOn: 1,
      transactions: [],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "transactions",
  });

  const onSubmit = async (data: PaymentOrderFormValues) => {
    setIsSubmitting(true);

    const enhancedData = {
      ...data,
      id: paymentOrderId.current,
      validFrom: new Date(data.validFrom),
      transactions: data.transactions.map((transaction) => transaction.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const paymentOrderData = PaymentOrder.safeParse(enhancedData);

    if (!paymentOrderData.success) {
      setErrorMessage(paymentOrderData.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    // save to the database
    // if that works, redirect to the accounts page
    // if it doesn't, show an error message
    try {
      await db.transaction(
        "rw",
        db.paymentOrders,
        db.paymentOrderTransactions,
        async () => {
          // store the PO
          await db.paymentOrders.add(paymentOrderData.data);

          // store it's transactions
          await db.paymentOrderTransactions.bulkAdd(data.transactions);
        },
      );

      router.push("/payment_orders");
      setIsSubmitting(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Neznámá chyba");
      setIsSubmitting(false);
    }
  };

  const handlePaymentOrderTransactionFormSuccess = (
    data: PaymentOrderTransaction,
  ) => {
    append(data);
    closeDialog();
  };

  return (
    <>
      <FormErrorMessage errorMessage={errorMessage} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <Separator />

          <div className={"space-y-2"}>
            <h3
              className={
                "flex justify-between items-center text-xl font-bold pb-1 px-1"
              }
            >
              Transakce
              <Button
                type="button"
                variant={"secondary"}
                onClick={() =>
                  openDialog(
                    <>
                      <DialogHeader>
                        <DialogTitle>Přidat transakci</DialogTitle>

                        <DialogDescription className="sr-only">
                          Vyplňte formulář pro přidání transakce
                        </DialogDescription>
                      </DialogHeader>

                      <PaymentOrderTransactionForm
                        paymentOrderId={paymentOrderId.current}
                        onSuccess={handlePaymentOrderTransactionFormSuccess}
                      >
                        {(form) => (
                          <>
                            {form}

                            <DialogFooter className="sm:justify-start mt-6">
                              <SubmitButton>Uložit transakci</SubmitButton>
                            </DialogFooter>
                          </>
                        )}
                      </PaymentOrderTransactionForm>
                    </>,
                  )
                }
              >
                Přidat transakci
              </Button>
            </h3>

            <PaymentOrderTransactionsList
              transactions={fields}
              removeAction={remove}
            />
          </div>

          <SubmitButton isSubmitting={isSubmitting}>
            {isSubmitting ? "Ukládám..." : "Uložit"}
          </SubmitButton>
        </form>
      </Form>
    </>
  );
};

export default PaymentOrderForm;
