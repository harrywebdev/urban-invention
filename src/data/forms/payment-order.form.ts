import * as z from "zod";
import { PaymentOrder } from "@/data/types/payment-order.types";
import { PaymentOrderTransaction } from "@/data/types/payment-order-transaction.types";

export const PaymentOrderFormSchema = z.object({
  description: PaymentOrder.shape.description,
  validFrom: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  triggerOn: PaymentOrder.shape.triggerOn,
  transactions: z.array(PaymentOrderTransaction).min(1),
});

export type PaymentOrderFormValues = z.infer<typeof PaymentOrderFormSchema>;
