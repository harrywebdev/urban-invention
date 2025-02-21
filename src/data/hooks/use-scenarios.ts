import { useScenario } from "@/contexts/ScenarioContext";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";

export function useScenarios() {
  return useLiveQuery(() => db.scenarios.toArray(), []);
}

export function useCurrentScenario() {
  const { currentScenarioId } = useScenario();

  return useLiveQuery(
    async () =>
      currentScenarioId ? db.scenarios.get(currentScenarioId) : null,
    [currentScenarioId],
  );
}
