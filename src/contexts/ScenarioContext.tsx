"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CookieName, ScenarioId } from "@/data/types/types";
import { setCookie, removeCookie } from "typescript-cookie";

interface ScenarioContextType {
  currentScenarioId: ScenarioId | null;
  setCurrentScenarioId: (id: ScenarioId | null) => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(
  undefined,
);

export const ScenarioProvider = ({
  children,
  initialScenarioId,
}: {
  children: ReactNode;
  initialScenarioId: ScenarioId | null;
}) => {
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(
    initialScenarioId,
  );

  // on client, when choice is made, save it to cookie
  useEffect(() => {
    if (currentScenarioId) {
      setCookie(CookieName.enum.CurrentScenarioId, currentScenarioId, {
        path: "/",
      });
    } else {
      removeCookie(CookieName.enum.CurrentScenarioId);
    }
  }, [currentScenarioId]);

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
