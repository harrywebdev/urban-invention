import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import Link from "next/link";
import { BackButtonLink, buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function PaymentOrderIndexPageHeader() {
  return (
    <PageHeader>
      <PageHeaderTitle>Platební příkazy</PageHeaderTitle>

      <Link
        className={buttonVariants({ variant: "link" })}
        href="/payment_orders/add"
      >
        <PlusCircle className="h-4 w-4" />
        Přidat příkaz
      </Link>
    </PageHeader>
  );
}

export function PaymentOrderCreatePageHeader() {
  return (
    <PageHeader>
      <PageHeaderTitle>Přidat platební příkaz</PageHeaderTitle>

      <BackButtonLink href={"/payment_orders"}>Zpět</BackButtonLink>
    </PageHeader>
  );
}

export function PaymentOrderSelectScenarioPageHeader() {
  return (
    <PageHeader>
      <PageHeaderTitle>Vyber scénář</PageHeaderTitle>
    </PageHeader>
  );
}
