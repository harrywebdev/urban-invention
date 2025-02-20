"use client";

import { createContext, useContext, useState } from "react";
import { ScenarioId } from "@/data/types/types";

interface ScenarioContextType {
  currentScenarioId: ScenarioId | null;
  setCurrentScenarioId: (id: ScenarioId | null) => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(
  undefined,
);

export const ScenarioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(
    null,
  );

  return (
    <ScenarioContext.Provider
      value={{ currentScenarioId, setCurrentScenarioId }}
    >
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenario = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return context;
};
