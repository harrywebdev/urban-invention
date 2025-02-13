import { FC } from "react";
import { TransactionType } from "@/data/transaction.types";
import AccountBadge from "@/components/AccountBadge";
import { transactionVariants } from "@/components/ui/transaction";
import { formatTransactionMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { PaymentOrderTransaction } from "@/data/payment-order-transaction.types";
import EmptyState from "@/components/EmptyState";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import { AccountId } from "@/data/types";
import { Account } from "@/data/account.types";

type PaymentOrderTransactionsListProps = {
  transactions: PaymentOrderTransaction[];
  removeAction?: (index: number) => void;
  showEmptyState?: boolean;
};

const PaymentOrderTransactionsList: FC<PaymentOrderTransactionsListProps> = ({
  transactions,
  removeAction,
  showEmptyState = true,
}) => {
  // lookup table for the PO transactions
  const accounts = useLiveQuery(() => db.accounts.toArray());
  const findAccountById = (accountId: AccountId): Account | undefined =>
    accounts?.find((acc) => acc.id === accountId);

  if (transactions.length === 0) {
    return showEmptyState ? <EmptyState /> : null;
  }

  return (
    <ul className={"space-y-3"}>
      {transactions.map((transaction, index) => (
        <li
          key={transaction.id}
          className={`flex items-stretch justify-between p-4 bg-neutral-50/20 rounded-md border-b`}
        >
          <span className={"flex flex-col space-y-2"}>
            <span className={"pl-3 font-semibold"}>
              {transaction.description}
            </span>

            <span className={"flex flex-row items-center gap-4"}>
              {(transaction.type === TransactionType.enum.expense ||
                transaction.type === TransactionType.enum.transfer) && (
                <AccountBadge
                  account={findAccountById(transaction.fromAccount)}
                  transferIcon={"from"}
                />
              )}

              {(transaction.type === TransactionType.enum.income ||
                transaction.type === TransactionType.enum.transfer) && (
                <AccountBadge
                  account={findAccountById(transaction.toAccount)}
                  transferIcon={"to"}
                />
              )}
            </span>
          </span>

          <span className={"flex flex-col space-y-2 justify-between items-end"}>
            <span
              className={`font-semibold ${transactionVariants({ variant: transaction.type })}`}
            >
              {formatTransactionMoney(
                transaction.amount,
                transaction.currency,
                transaction.type,
              )}
            </span>

            {removeAction ? (
              <span className={"pb-1 block"}>
                <Button
                  type={"button"}
                  onClick={() => {
                    if (confirm("Opravdu chceš odebrat tuto transakci?")) {
                      removeAction(index);
                    }
                  }}
                  variant={"secondary"}
                  size={"icon"}
                  className={"text-red-500"}
                >
                  <Trash2Icon className={"w-6 h-6"} />
                </Button>
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PaymentOrderTransactionsList;
