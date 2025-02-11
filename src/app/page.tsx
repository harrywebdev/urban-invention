"use client";

import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CreditCardIcon } from "lucide-react";

export default function Home() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Úvod</PageHeaderTitle>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          className={`${buttonVariants({ size: "lg", variant: "secondary" })}`}
          href="/accounts"
        >
          <CreditCardIcon className="h-4 w-4" />
          Účty
        </Link>
      </div>
    </>
  );
}
