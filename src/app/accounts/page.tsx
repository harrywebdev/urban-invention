"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import { PlusCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AccountCard } from "@/components/AccountCard";
import Link from "next/link";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";

export default function Home() {
  const accounts = useLiveQuery(() => db.accounts.toArray());

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Účty</PageHeaderTitle>

        <Link
          className={buttonVariants({ variant: "link" })}
          href="/accounts/add"
        >
          <PlusCircle className="h-4 w-4" />
          Přidat účet
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {accounts?.map((account) => (
          <AccountCard
            key={account.id}
            name={account.name}
            accountNumber={account.accountNumber}
            routingNumber={account.routingNumber}
            type={account.type}
            currency={account.currency}
            balance={account.balance}
            creditLimit={
              account.type === "credit_card" ? account.creditLimit : undefined
            }
          />
        ))}
      </div>
    </>
  );
}
