"use client";

import { BackButtonLink } from "@/components/ui/button";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import PaymentOrderForm from "@/components/Forms/PaymentOrderForm";

export default function AddPaymentOrder() {
  return (
    <div className="container pb-4">
      <PageHeader>
        <PageHeaderTitle>Přidat platební příkaz</PageHeaderTitle>

        <BackButtonLink href={"/payment_orders"}>Zpět</BackButtonLink>
      </PageHeader>

      <PaymentOrderForm />
    </div>
  );
}
