import { cva } from "class-variance-authority";

export const transactionVariants = cva("", {
  variants: {
    variant: {
      transfer: "text-neutral-950 dark:text-neutral-50",
      expense:
        "text-red-500 [&>svg]:text-red-500 dark:text-red-900 dark:[&>svg]:text-red-900",
      income:
        "text-emerald-500 [&>svg]:text-emerald-500 dark:text-emerald-900 dark:[&>svg]:text-emerald-900",
    },
  },
  defaultVariants: {
    variant: "transfer",
  },
});
