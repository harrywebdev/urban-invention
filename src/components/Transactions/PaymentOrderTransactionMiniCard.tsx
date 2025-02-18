import { FC } from "react";
import {
  forcePaymentOrderTransactionTypeWithoutTransfer,
  PaymentOrderTransaction,
} from "@/data/types/payment-order-transaction.types";
import { transactionVariants } from "@/components/ui/transaction";
import { formatTransactionMoney } from "@/lib/utils";
import { AccountId, MoneyAmount } from "@/data/types/types";

type PaymentOrderTransactionMiniCardProps = {
  paymentOrderTriggerOn: number;
  transaction: PaymentOrderTransaction;
  accountId: AccountId;
  balance?: MoneyAmount;
};

const PaymentOrderTransactionMiniCard: FC<
  PaymentOrderTransactionMiniCardProps
> = ({ paymentOrderTriggerOn, transaction, accountId, balance }) => {
  const forcedType = forcePaymentOrderTransactionTypeWithoutTransfer(
    transaction,
    accountId,
  );

  // get amount of dots from balance - 1 dot per every 10000, rounded up
  const dots = balance !== undefined ? Math.ceil(Math.abs(balance) / 10000) : 0;
  const dotsArray = Array.from({ length: dots }, (_, i) => i);

  const balanceClass =
    balance === undefined
      ? ""
      : balance > 0
        ? "bg-emerald-500"
        : balance === 0
          ? "bg-neutral-500"
          : "bg-rose-500";

  // 4 dots cols is max = w-8
  // there's 5 dots per col
  let dotsWidthClass = "w-8";
  switch (true) {
    case dots <= 5:
      dotsWidthClass = "w-2";
      break;
    case dots <= 10:
      dotsWidthClass = "w-4";
      break;
    case dots <= 15:
      dotsWidthClass = "w-6";
      break;
  }

  return (
    <span
      key={transaction.id}
      className={`flex flex-col gap-1 items-stretch justify-between p-4 bg-neutral-50/20 rounded-md border-b pr-8 relative`}
    >
      <span className={"text-sm line-clamp-2"}>
        {paymentOrderTriggerOn}. {transaction.description}
      </span>

      <span
        className={`text-sm ${transactionVariants({ variant: forcedType })}`}
      >
        {formatTransactionMoney(
          transaction.amount,
          transaction.currency,
          forcedType,
        )}
      </span>

      <span
        className={`absolute bottom-5 right-0 ${dotsWidthClass} h-10 flex flex-col gap-1 justify-end flex-wrap-reverse overflow-hidden`}
      >
        {dotsArray.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-1 rounded-full ${balanceClass}`}
          ></span>
        ))}
      </span>
    </span>
  );
};

export default PaymentOrderTransactionMiniCard;
