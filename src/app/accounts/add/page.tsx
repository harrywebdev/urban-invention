"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BackButtonLink, SubmitButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import { Currency } from "@/data/types/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import CurrencyFormField from "@/components/FormFields/CurrencyFormField";
import AmountFormField from "@/components/FormFields/AmountFormField";
import { Account, AccountType } from "@/data/types/account.types";
import { createAccount } from "@/data/hooks/use-accounts";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  routingNumber: z
    .string()
    .min(4, "Routing number must be at least 4 characters"),
  type: AccountType,
  currency: Currency,
  balance: z.number().min(0, "Balance must be a positive number"),
  creditLimit: z.number().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function AddAccount() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      accountNumber: "",
      routingNumber: "",
      type: AccountType.enum.debit,
      balance: 0,
      currency: Currency.enum.CZK,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    const enhancedData = {
      ...data,
      transactions: [],
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const validatedData = Account.safeParse(enhancedData);

    if (!validatedData.success) {
      setErrorMessage(validatedData.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    // save to the database
    // if that works, redirect to the accounts page
    // if it doesn't, show an error message
    try {
      await createAccount(validatedData.data);

      router.push("/accounts");
      setIsSubmitting(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Neznámá chyba");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={"lg:max-w-2xl"}>
        <PageHeader>
          <PageHeaderTitle>Přidat účet</PageHeaderTitle>

          <BackButtonLink href={"/accounts"}>Zpět na účty</BackButtonLink>
        </PageHeader>
      </div>

      {errorMessage && (
        <div className={"lg:max-w-2xl"}>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container pb-4 lg:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jméno účtu</FormLabel>
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
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Číslo účtu</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kód banky</FormLabel>
                    <FormControl>
                      <Input placeholder="XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={"grid grid-cols-[2fr_1fr] gap-4 w-full"}>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ účtu</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyber typ účtu" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="debit">Běžný</SelectItem>

                        <SelectItem value="savings">Spořicí</SelectItem>

                        <SelectItem value="credit_card">
                          Kreditní karta
                        </SelectItem>

                        <SelectItem value="prepaid_card">
                          Předplacená karta
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <CurrencyFormField control={form.control} name={"currency"} />
            </div>

            <AmountFormField
              control={form.control}
              name={"balance"}
              label={"Počáteční zůstatek"}
              description={"Zadej počáteční zůstatek pro tento účet."}
            />

            {form.watch("type") === "credit_card" && (
              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limit kreditní karty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <SubmitButton isSubmitting={isSubmitting}>
              {isSubmitting ? "Ukládám..." : "Uložit"}
            </SubmitButton>
          </form>
        </Form>
      </div>
    </>
  );
}
