"use client";

import { ReactNode } from "react";
import { useScenario } from "@/contexts/ScenarioContext";
import SelectScenarioPage from "@/components/SelectScenarioPage";

export default function PaymentOrderssLayout({
  children,
}: {
  children: ReactNode;
}) {
  // if there's no scenario ID, select one
  const { currentScenarioId } = useScenario();

  if (!currentScenarioId) {
    return <SelectScenarioPage />;
  }

  return children;
}
