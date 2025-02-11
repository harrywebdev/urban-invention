"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Account, AccountType, Currency } from "@/data/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, PlusCircle } from "lucide-react";
import { db } from "@/data/db";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

// Define the Zod schema
const AccountSchema = z.object({
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

type AccountFormValues = z.infer<typeof AccountSchema>;

export default function AddAccount() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      name: "",
      accountNumber: "",
      routingNumber: "",
      type: AccountType.enum.debit,
      balance: 0,
      currency: Currency.enum.CZK,
    },
  });

  const onSubmit = async (data: AccountFormValues) => {
    setIsSubmitting(true);

    const enhancedData = {
      ...data,
      transactions: [],
      id: uuidv4(),
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
      await db.accounts.add(validatedData.data);

      router.push("/");
      setIsSubmitting(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Neznámá chyba");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container pb-4">
      <PageHeader>
        <PageHeaderTitle>Přidat účet</PageHeaderTitle>

        <Link className={buttonVariants({ variant: "link" })} href="/accounts">
          <ChevronLeft className="h-4 w-4" />
          Zpět na účty
        </Link>
      </PageHeader>

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Měna účtu</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyber měnu účtu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CZK">CZK</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Počáteční zůstatek</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        isNaN(Number.parseFloat(e.target.value))
                          ? ""
                          : Number.parseFloat(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  Zadej počáteční zůstatek pro tento účet.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ukládám..." : "Uložit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
