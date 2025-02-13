"use client";

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentOrderTransactionFormSchema,
  PaymentOrderTransactionFormValues,
} from "@/data/forms/payment-order-transaction.form";
import { PaymentOrderId } from "@/data/types";
import FormErrorMessage from "@/components/FormFields/FormErrorMessage";
import TransactionTypeFormField from "@/components/FormFields/TransactionTypeFormField";
import AmountFormField from "@/components/FormFields/AmountFormField";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import AccountPickerFormField from "@/components/FormFields/AccountPickerFormField";
import { db } from "@/data/db";
import { useLiveQuery } from "dexie-react-hooks";
import invariant from "tiny-invariant";
import { PaymentOrderTransaction } from "@/data/payment-order-transaction.types";
import { TransactionType } from "@/data/transaction.types";

type PaymentOrderTransactionFormProps = {
  children: (form: ReactNode) => ReactNode;
  paymentOrderId: PaymentOrderId;
  onSuccess: (data: PaymentOrderTransaction) => void;
};

const PaymentOrderTransactionForm: FC<PaymentOrderTransactionFormProps> = ({
  children,
  paymentOrderId,
  onSuccess,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const accounts = useLiveQuery(() => db.accounts.toArray());
  const fromAccountRef = useRef<HTMLButtonElement>(null);
  const toAccountRef = useRef<HTMLButtonElement>(null);

  const form = useForm<PaymentOrderTransactionFormValues>({
    resolver: zodResolver(PaymentOrderTransactionFormSchema),
    defaultValues: {
      amount: 0,
      description: "",
      fromAccount: "",
    },
  });
  const { control, watch } = form;

  const watchTransactionType = watch("type");
  const watchCurrency = watch("currency");
  const watchFromAccount = watch("fromAccount");
  const watchToAccount = watch("toAccount");

  const onSubmit = async (data: PaymentOrderTransactionFormValues) => {
    const enhancedData = {
      ...data,
      id: uuidv4(),
      paymentOrderId: paymentOrderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const validatedData = PaymentOrderTransaction.safeParse(enhancedData);

    if (!validatedData.success) {
      setErrorMessage(validatedData.error.errors[0].message);
      return;
    }

    try {
      onSuccess(validatedData.data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Neznámá chyba");
    }
  };

  const focusField = (cb: () => void) => setTimeout(cb, 10);

  const showFromAccount =
    watchTransactionType === TransactionType.enum.transfer ||
    watchTransactionType === TransactionType.enum.expense;

  const showToAccount =
    watchTransactionType === TransactionType.enum.transfer ||
    watchTransactionType === TransactionType.enum.income;

  const isToAccountDisabled =
    watchTransactionType === TransactionType.enum.transfer && !watchFromAccount;

  // set the currency based on the relevant account
  useEffect(() => {
    if (!accounts || !accounts.length) {
      return;
    }

    function setCurrencyBasedOnAccount(accountId: string) {
      invariant(accounts, "Accounts are required");

      const account = accounts.find((account) => account.id === accountId);

      invariant(account, "Account not found");

      form.setValue("currency", account.currency);
    }

    // in case both accounts are selected, the "from" account should be the one that sets the currency
    // as it's the first one to be set
    if (watchFromAccount) {
      setCurrencyBasedOnAccount(watchFromAccount);
      return;
    }

    if (watchToAccount) {
      setCurrencyBasedOnAccount(watchToAccount);
      return;
    }
  }, [accounts, form, watchFromAccount, watchToAccount]);

  // clear out the selected accounts if they are not relevant
  const handleTransactionTypeOnChange = (type: TransactionType) => {
    switch (type) {
      case TransactionType.enum.income:
        form.setValue("fromAccount", "");
        break;

      // when selecting Transfer, keep the "from" account (it could be
      // very well suitable value there) but always reset "to" account
      // (so it's always the "from" that must be selected first and determines
      // the currency)
      case TransactionType.enum.transfer:
      case TransactionType.enum.expense:
        form.setValue("toAccount", "");
        break;
    }

    // pop focus on the next field (wait for render though, otherwise
    // the focus is stolen)
    focusField(() => {
      form.setFocus("amount");
    });
  };

  // also, anytime fromAccount changes, reset the toAccount (the currency could've changed)
  useEffect(() => {
    if (watchFromAccount) {
      form.setValue("toAccount", "");
    }
  }, [form, watchFromAccount]);

  const formContent = (
    <div className="container space-y-6">
      <FormErrorMessage errorMessage={errorMessage} />

      <div className={"grid sm:grid-cols-2 gap-4 w-full"}>
        <TransactionTypeFormField
          control={control}
          name={`type`}
          onChange={(value) => handleTransactionTypeOnChange(value)}
        />

        <AmountFormField
          control={control}
          name={`amount`}
          label={"Částka"}
          currency={watchCurrency}
        />
      </div>

      {(showFromAccount || showToAccount) && (
        <div
          className={`grid ${showFromAccount && showToAccount ? "sm:grid-cols-2" : "sm:grid-cols-1"} gap-4 w-full`}
        >
          {showFromAccount && (
            <AccountPickerFormField
              control={control}
              name={"fromAccount"}
              label={"Z účtu"}
              ref={fromAccountRef}
              onChange={() => {
                focusField(() => {
                  if (showToAccount) {
                    toAccountRef.current?.focus();
                  } else {
                    form.setFocus("description");
                  }
                });
              }}
            />
          )}

          {showToAccount && (
            <AccountPickerFormField
              control={control}
              name={"toAccount"}
              label={"Na účet"}
              limitByCurrency={watchFromAccount ? watchCurrency : undefined}
              ignoreAccountId={watchFromAccount ?? undefined}
              ref={toAccountRef}
              isDisabled={isToAccountDisabled}
              onChange={() => {
                focusField(() => {
                  form.setFocus("description");
                });
              }}
            />
          )}
        </div>
      )}

      <FormField
        control={control}
        name={`description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Popis</FormLabel>
            <FormControl>
              <Input type={"text"} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children(formContent)}
      </form>
    </FormProvider>
  );
};

export default PaymentOrderTransactionForm;
