import { FC, useMemo } from "react";
import EmptyState from "@/components/EmptyState";
import {
  isPaymentOrderTransactionWithFromAccount,
  isPaymentOrderTransactionWithToAccount,
  PaymentOrderTransaction,
} from "@/data/types/payment-order-transaction.types";
import { PaymentOrderWithTransactions } from "@/data/types/payment-order.types";
import { AccountId } from "@/data/types/types";
import { useAccounts } from "@/data/hooks/use-accounts";
import Loader from "@/components/Loader";
import AccountBadge from "@/components/AccountBadge";
import { Account } from "@/data/types/account.types";
import { filterPaymentOrderTransactionsByAccountId } from "@/data/hooks/use-payment-order-transactions";
import PaymentOrderTransactionMiniCard from "@/components/Transactions/PaymentOrderTransactionMiniCard";

type PaymentOrdersColumnsViewProps = {
  paymentOrders: PaymentOrderWithTransactions[];
};

type PresentedColumn = {
  account: Account;
  paymentOrders: PaymentOrderWithTransactions[];
};

const PaymentOrdersColumnsView: FC<PaymentOrdersColumnsViewProps> = ({
  paymentOrders,
}) => {
  const transactions = useMemo(
    () => paymentOrders.flatMap((po) => po.transactions),
    [paymentOrders],
  );

  // for `presentingView === "accountColumns"` we need to list only
  // the relevant (involved) accounts and show the transactions in account columns
  const involvedAccountIds = useMemo(
    () =>
      Array.from(
        (transactions ?? []).reduce((acc, tx: PaymentOrderTransaction) => {
          if (isPaymentOrderTransactionWithFromAccount(tx)) {
            acc.add(tx.fromAccount);
          }
          if (isPaymentOrderTransactionWithToAccount(tx)) {
            acc.add(tx.toAccount);
          }

          return acc;
        }, new Set<AccountId>()),
      ),
    [transactions],
  );

  const { data: accounts, isLoading } = useAccounts(involvedAccountIds);

  const presentedColumns: PresentedColumn[] = useMemo(
    () =>
      accounts.map((account) => {
        const accountPaymentOrders = paymentOrders.map((po) => ({
          ...po,
          transactions: filterPaymentOrderTransactionsByAccountId(account.id)(
            po.transactions,
          ),
        }));

        return {
          account,
          paymentOrders: accountPaymentOrders,
        };
      }),
    [accounts, paymentOrders],
  );

  if (isLoading) {
    return <Loader />;
  }

  if (accounts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex items-stretch justify-between overflow-auto h-full">
      {presentedColumns.map(({ account, paymentOrders }) => (
        <div
          key={account.id}
          className="flex flex-col gap-2 border-r px-4 first:pl-0 last:border-r-0"
        >
          <AccountBadge account={account} />

          <ul>
            {paymentOrders.map((po) => (
              <li key={po.id}>
                {po.transactions.map((transaction) => (
                  <PaymentOrderTransactionMiniCard
                    key={transaction.id}
                    paymentOrderTriggerOn={po.triggerOn}
                    transaction={transaction}
                    accountId={account.id}
                  />
                ))}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PaymentOrdersColumnsView;
