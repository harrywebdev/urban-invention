import * as z from "zod";
import { ScenarioId } from "@/data/types/types";

export const SelectScenarioFormSchema = z.object({
  scenarioId: ScenarioId,
});

export type SelectScenarioFormValues = z.infer<typeof SelectScenarioFormSchema>;
