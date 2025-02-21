import { FC, useMemo } from "react";
import EmptyState from "@/components/EmptyState";
import {
  forcePaymentOrderTransactionTypeWithoutTransfer,
  isPaymentOrderTransactionWithFromAccount,
  isPaymentOrderTransactionWithToAccount,
  PaymentOrderTransaction,
  PaymentOrderTransactionWithBalance,
} from "@/data/types/payment-order-transaction.types";
import {
  PaymentOrderWithTransactions,
  PaymentOrderWithTransactionsAndBalance,
} from "@/data/types/payment-order.types";
import { AccountId } from "@/data/types/types";
import { useAccounts } from "@/data/hooks/use-accounts";
import Loader from "@/components/Loader";
import AccountBadge from "@/components/AccountBadge";
import { Account } from "@/data/types/account.types";
import { filterPaymentOrderTransactionsByAccountId } from "@/data/hooks/use-payment-order-transactions";
import PaymentOrderTransactionMiniCard from "@/components/PaymentOrderTransactions/PaymentOrderTransactionMiniCard";
import { transactionVariants } from "@/components/ui/transaction";
import { formatTransactionMoney } from "@/lib/utils";
import PaymentOrderMiniCard from "@/components/PaymentOrders/PaymentOrderMiniCard";

type PaymentOrdersTableViewProps = {
  paymentOrders: PaymentOrderWithTransactions[];
  hasGroupsByPaymentOrders: boolean;
};

type PresentedRow = {
  dayOfMonth: number;
  columns: {
    account: Account;
    paymentOrders: PaymentOrderWithTransactionsAndBalance[];
  }[];
};

const PaymentOrdersTableView: FC<PaymentOrdersTableViewProps> = ({
  paymentOrders,
  hasGroupsByPaymentOrders,
}) => {
  const transactions = useMemo(
    () => paymentOrders.flatMap((po) => po.transactions),
    [paymentOrders],
  );

  // we need to list only relevant (involved) accounts and show the transactions in account columns
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

  const tableRows: PresentedRow[] = useMemo(() => {
    const rows: PresentedRow[] = [];

    // day 0 = just a header with every accounts
    rows.push({
      dayOfMonth: 0,
      columns: accounts.map((account) => ({
        account,
        paymentOrders: [],
      })),
    });

    // loop from 1 to 28 and for each day, get accounts with payment orders on that day
    for (let i = 1; i <= 29; i++) {
      const accountsForDay = accounts.map((account, accIndex) => {
        // first only payment orders for the current day
        const paymentOrdersForTheDay = paymentOrders.filter(
          (po) => po.triggerOn === i,
        );

        // then, get only those payment orders, that have at least one transaction for the current accounts
        const accountPaymentOrders = paymentOrdersForTheDay
          .map((po) => {
            const transactionsForAccount =
              filterPaymentOrderTransactionsByAccountId(account.id)(
                po.transactions,
              );

            return {
              ...po,
              transactions: transactionsForAccount,
            };
          })
          .filter((po) => po.transactions.length > 0);

        // now, add to those transactions balance - take account.balance as a starting point and for each
        // transaction, apply it to get the new "transaction balance"
        const paymentOrdersWithTransactionsAndBalance: PaymentOrderWithTransactionsAndBalance[] =
          accountPaymentOrders.reduce((acc, po) => {
            // starting balance for the transaction is:
            //    1. previous tx balance
            //    2. if not present, then previous PO last tx balance
            //    3. if not present, then previous day account balance
            //    4. if not present, then default account balance (default)

            // 4.
            let txBalance = account.balance;

            // 2.
            const previousPaymentOrderLastTransactionBalance = acc
              .at(-1)
              ?.transactions.at(-1)?.balance;
            if (previousPaymentOrderLastTransactionBalance) {
              txBalance = previousPaymentOrderLastTransactionBalance;
            } else {
              // 3.
              const previousDayAccountBalance =
                rows.at(-1)?.columns[accIndex].account.balance;
              if (previousDayAccountBalance) {
                txBalance = previousDayAccountBalance;
              }
            }

            const transactionsWithBalance = po.transactions.reduce(
              (txs, tx) => {
                const forcedType =
                  forcePaymentOrderTransactionTypeWithoutTransfer(
                    tx,
                    account.id,
                  );

                if (forcedType === "income") {
                  txBalance += tx.amount;
                }

                if (forcedType === "expense") {
                  txBalance -= tx.amount;
                }

                txs.push({
                  ...tx,
                  balance: txBalance,
                });

                return txs;
              },
              [] as PaymentOrderTransactionWithBalance[],
            );

            acc.push({
              ...po,
              transactions: transactionsWithBalance,
            });

            return acc;
          }, [] as PaymentOrderWithTransactionsAndBalance[]);

        // now update this columns account balance with the the most recent one
        const lastTransactionBalance = paymentOrdersWithTransactionsAndBalance
          .at(-1)
          ?.transactions.at(-1)?.balance;

        const previousDayAccountBalance =
          rows.at(-1)?.columns[accIndex].account.balance;

        return {
          account: {
            ...account,
            balance:
              lastTransactionBalance ??
              previousDayAccountBalance ??
              account.balance,
          },
          paymentOrders: paymentOrdersWithTransactionsAndBalance,
        };
      });

      const hasAnyPaymentOrderForDay = accountsForDay.some(
        (account) => account !== undefined,
      );

      if (hasAnyPaymentOrderForDay) {
        rows.push({
          dayOfMonth: i,
          columns: accountsForDay,
        });
      }
    }

    return rows;
  }, [accounts, paymentOrders]);

  if (isLoading) {
    return <Loader />;
  }

  if (accounts.length === 0) {
    return <EmptyState />;
  }

  let gridColsClass = "grid-cols-1";
  switch (accounts.length) {
    case 2:
      gridColsClass = "grid-cols-2";
      break;
    case 3:
      gridColsClass = "grid-cols-3";
      break;
    case 4:
      gridColsClass = "grid-cols-4";
      break;
    case 5:
      gridColsClass = "grid-cols-5";
      break;
    case 6:
      gridColsClass = "grid-cols-6";
      break;
    case 7:
      gridColsClass = "grid-cols-7";
      break;
    case 8:
      gridColsClass = "grid-cols-8";
      break;
    case 9:
      gridColsClass = "grid-cols-9";
      break;
    case 10:
      gridColsClass = "grid-cols-10";
      break;
    case 11:
      gridColsClass = "grid-cols-11";
      break;
    case 12:
      gridColsClass = "grid-cols-12";
      break;
  }

  return (
    <div className="overflow-auto h-full max-w-full">
      <div className="h-full min-w-max">
        {tableRows.map((row) => (
          <div
            key={`day_${row.dayOfMonth}`}
            className={`grid ${gridColsClass} gap-2`}
          >
            {row.columns.map((column, index) => (
              <div
                key={`col_${row.dayOfMonth}_${index}`}
                className="flex flex-col gap-2 border-r pl-3 pr-4 first:pl-0 last:border-r-0 max-w-56"
              >
                {row.dayOfMonth === 0 ? (
                  <AccountBadge account={column?.account} />
                ) : row.dayOfMonth === 29 && column ? (
                  <span
                    className={`flex flex-col gap-1 items-stretch justify-between p-4 bg-neutral-50/20 rounded-md border-b`}
                  >
                    <span className={"text-sm font-semibold line-clamp-2"}>
                      Zůstatek:
                    </span>

                    <span
                      className={`text-sm font-semibold ${transactionVariants({ variant: column.account.balance > 0 ? "income" : column.account.balance === 0 ? "transfer" : "expense" })}`}
                    >
                      {formatTransactionMoney(
                        Math.abs(column.account.balance),
                        column.account.currency,
                        column.account.balance > 0
                          ? "income"
                          : column.account.balance === 0
                            ? "transfer"
                            : "expense",
                      )}
                    </span>
                  </span>
                ) : (
                  <>
                    {column ? (
                      <>
                        {column.paymentOrders.map((po) => (
                          <span key={po.id} className="flex flex-col">
                            {hasGroupsByPaymentOrders ? (
                              <PaymentOrderMiniCard
                                key={po.id}
                                paymentOrder={po}
                                accountId={column.account.id}
                              />
                            ) : (
                              po.transactions.map((transaction) => (
                                <PaymentOrderTransactionMiniCard
                                  key={transaction.id}
                                  paymentOrderId={po.id}
                                  paymentOrderTriggerOn={po.triggerOn}
                                  transaction={transaction}
                                  accountId={column.account.id}
                                  balance={transaction.balance}
                                />
                              ))
                            )}
                          </span>
                        ))}
                      </>
                    ) : null}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentOrdersTableView;
