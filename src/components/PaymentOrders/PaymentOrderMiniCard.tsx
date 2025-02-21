import { FC } from "react";
import { forcePaymentOrderTransactionTypeWithoutTransfer } from "@/data/types/payment-order-transaction.types";
import { transactionVariants } from "@/components/ui/transaction";
import { formatTransactionMoney } from "@/lib/utils";
import { AccountId } from "@/data/types/types";
import {
  PaymentOrderWithoutTransactions,
  PaymentOrderWithTransactions,
} from "@/data/types/payment-order.types";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/ui/button";
import { useDialogStore } from "@/stores/use-dialog.store";
import PaymentOrderEditForm from "../Forms/PaymentOrderEditForm";
import { updatePaymentOrder } from "@/data/hooks/use-payment-orders";

type PaymentOrderMiniCardProps = {
  paymentOrder: PaymentOrderWithTransactions;
  accountId: AccountId;
};

const PaymentOrderMiniCard: FC<PaymentOrderMiniCardProps> = ({
  paymentOrder,
  accountId,
}) => {
  const { openDialog, closeDialog } = useDialogStore();

  const transactionsSubtotal = paymentOrder.transactions.reduce((acc, tx) => {
    // TODO: add currency/conversion
    if (tx.currency !== "CZK") {
      return acc;
    }

    const forcedType = forcePaymentOrderTransactionTypeWithoutTransfer(
      tx,
      accountId,
    );

    if (forcedType === "income") {
      return acc + tx.amount;
    }

    if (forcedType === "expense") {
      return acc - tx.amount;
    }

    return acc;
  }, 0);

  const cardVariantType =
    transactionsSubtotal > 0
      ? "income"
      : transactionsSubtotal === 0
        ? "transfer"
        : "expense";

  const handlePaymentOrderEditFormSubmit = async (
    data: PaymentOrderWithoutTransactions,
  ) => {
    await updatePaymentOrder(data);
    closeDialog();
  };

  const handleOnClick = () =>
    openDialog(
      <>
        <DialogHeader>
          <DialogTitle>Upravit platební příkaz</DialogTitle>

          <DialogDescription className="sr-only">
            Vyplňte formulář pro úpravu platebního příkazu
          </DialogDescription>
        </DialogHeader>

        <PaymentOrderEditForm
          paymentOrder={paymentOrder}
          handleSubmit={handlePaymentOrderEditFormSubmit}
        >
          {(form, isSubmitting) => (
            <>
              {form}

              <DialogFooter className="sm:justify-start mt-6">
                <SubmitButton isSubmitting={isSubmitting}>
                  Uložit příkaz
                </SubmitButton>
              </DialogFooter>
            </>
          )}
        </PaymentOrderEditForm>
      </>,
    );

  return (
    <span
      className={`flex flex-col gap-1 items-stretch justify-between p-4 bg-neutral-50/20 rounded-md border-b pr-8 relative pointer`}
      role={"button"}
      onClick={handleOnClick}
    >
      <span className={"text-sm line-clamp-2"}>
        {paymentOrder.triggerOn}. {paymentOrder.description}
      </span>

      <span
        className={`text-sm ${transactionVariants({ variant: cardVariantType })}`}
      >
        {formatTransactionMoney(
          Math.abs(transactionsSubtotal),
          paymentOrder.transactions[0]?.currency ?? "CZK", // TODO: add currency/conversion
          cardVariantType,
        )}
      </span>
    </span>
  );
};

export default PaymentOrderMiniCard;
