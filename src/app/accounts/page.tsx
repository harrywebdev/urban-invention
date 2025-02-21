"use client";

import { PlusCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AccountCard } from "@/components/AccountCard";
import Link from "next/link";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { useAccounts } from "@/data/hooks/use-accounts";

export default function Home() {
  const { data: accounts } = useAccounts();

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

      {accounts?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
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
      ) : (
        <EmptyState />
      )}
    </>
  );
}
