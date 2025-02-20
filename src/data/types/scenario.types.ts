import { z } from "zod";
import { ScenarioId, Timestamp } from "@/data/types/types";

export const Scenario = z.object({
  id: ScenarioId,
  name: z.string(),
  createdAt: Timestamp,
  updatedAt: Timestamp,
});
export type Scenario = z.infer<typeof Scenario>;
