import * as z from "zod";
import { ScenarioId } from "@/data/types/types";

export const PaymentOrderSelectScenarioFormSchema = z.object({
  scenarioId: ScenarioId,
});

export type PaymentOrderSelectScenarioFormValues = z.infer<
  typeof PaymentOrderSelectScenarioFormSchema
>;
