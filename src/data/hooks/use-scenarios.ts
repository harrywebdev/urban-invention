import { useScenario } from "@/contexts/ScenarioContext";
import { useLiveQuery } from "dexie-react-hooks";
import { client } from "@/data/db/client";

export function useScenarios() {
  return useLiveQuery(() => client.scenarios.toArray(), []);
}

export function useCurrentScenario() {
  const { currentScenarioId } = useScenario();

  return useLiveQuery(
    async () =>
      currentScenarioId ? client.scenarios.get(currentScenarioId) : null,
    [currentScenarioId],
  );
}
