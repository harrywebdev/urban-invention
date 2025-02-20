"use client";

import { ReactNode } from "react";
import { useScenario } from "@/contexts/ScenarioContext";
import PaymentOrderSelectScenarioPage from "@/components/PaymentOrders/PaymentOrderSelectScenarioPage";

export default function PaymentOrderssLayout({
  children,
}: {
  children: ReactNode;
}) {
  // if there's no scenario ID, select one
  const { currentScenarioId } = useScenario();

  if (!currentScenarioId) {
    return <PaymentOrderSelectScenarioPage />;
  }

  return children;
}
