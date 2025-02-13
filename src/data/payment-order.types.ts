import { z } from "zod";
import {
  PaymentOrderId,
  PaymentOrderTransactionId,
  Timestamp,
} from "@/data/types";

export const PaymentOrder = z.object({
  id: PaymentOrderId,
  description: z.string().min(1),
  validFrom: Timestamp,
  triggerOn: z.number().min(1).max(28),
  transactions: z.array(PaymentOrderTransactionId),
  createdAt: Timestamp,
  updatedAt: Timestamp,
});
export type PaymentOrder = z.infer<typeof PaymentOrder>;
