"use client";

import PaymentOrderForm from "@/components/Forms/PaymentOrderForm";
import { PaymentOrderCreatePageHeader } from "@/components/PaymentOrders/PaymentOrderPageHeaders";
import { useScenario } from "@/contexts/ScenarioContext";

export default function AddPaymentOrder() {
  const { currentScenarioId } = useScenario();

  if (!currentScenarioId) {
    // handled in layout
    return null;
  }

  return (
    <>
      <div className={"lg:max-w-2xl"}>
        <PaymentOrderCreatePageHeader />
      </div>

      <div className={"lg:max-w-2xl"}>
        <PaymentOrderForm currentScenarioId={currentScenarioId} />
      </div>
    </>
  );
}
