import { z } from "zod";
import { MoneyAmount } from "@/data/types/types";

export const TimelineFormSchema = z.object({
  startsFrom: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  endsAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  accountBalance: MoneyAmount,
});
export type TimelineFormValues = z.infer<typeof TimelineFormSchema>;
