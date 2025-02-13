"use client";

import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CogIcon, CreditCardIcon, SplitIcon } from "lucide-react";

export default function Home() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Index</PageHeaderTitle>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          className={`${buttonVariants({ size: "lg", variant: "secondary" })}`}
          href="/accounts"
        >
          <CreditCardIcon className="h-4 w-4" />
          Účty
        </Link>

        <Link
          className={`${buttonVariants({ size: "lg", variant: "secondary" })}`}
          href="/payment_orders"
        >
          <SplitIcon className="h-4 w-4" />
          Platební příkazy
        </Link>

        <Link
          className={`${buttonVariants({ size: "lg", variant: "secondary" })}`}
          href="/settings"
        >
          <CogIcon className="h-4 w-4" />
          Nastavení
        </Link>
      </div>
    </>
  );
}
