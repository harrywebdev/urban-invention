import { v4 as uuidv4 } from "uuid";
import { db } from "@/data/db";
import { Account } from "@/data/types/account.types";
import { PaymentOrder } from "@/data/types/payment-order.types";
import { PaymentOrderId } from "@/data/types/types";
import { PaymentOrderTransaction } from "@/data/types/payment-order-transaction.types";

// seed Accounts
// format:
// [
//   {
//     "name": "",
//     "accountNumber": "",
//     "routingNumber": "",
//     "iban": "",
//     "swift": "",
//     "type": "",
//     "currency": "CZK",
//     "sequence": 0,
//   }
// ]
// see ../account.types.ts for type definition
export const seedAccounts = async () => {
  const accountsData = (await import("./accounts.json")).default;

  const data: Account[] = accountsData.map((accountData) =>
    Account.parse({
      ...accountData,
      id: uuidv4(),
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );

  for (const account of data) {
    const foundAccount = await db.accounts
      .where({
        accountNumber: account.accountNumber,
        routingNumber: account.routingNumber,
      })
      .filter((a) => a.currency === account.currency)
      .first();

    if (!foundAccount) {
      await db.accounts.add(account);
    }
  }
};

// seed payment orders
// format:
// [
//   {
//     "description": "",
//     "validFrom": "2020-01-01T00:00:00.000Z",
//     "triggerOn": 1,
//     "transactions": [
//       {
//         "currency": "",
//         "amount": "",
//         "description": "",
//         "type": "income|expense|transfer",
//         "fromAccount": "12345678/9876/CZK",
//         "toAccount": "12345678/9876/CZK"
//       }
//     ]
//   }
// ]
// see ../payment-order.types.ts for type definition
export const seedPaymentOrders = async () => {
  const paymentOrdersData = (await import("./payment-orders.json")).default;

  // get all the accounts for the transactions
  const accounts = await db.accounts.toArray();

  const data: {
    paymentOrder: PaymentOrder;
    paymentOrderTransactions: PaymentOrderTransaction[];
  }[] = paymentOrdersData.map((paymentOrderData) => {
    const paymentOrderId = PaymentOrderId.parse(uuidv4());

    const paymentOrderTransactions = paymentOrderData.transactions.map(
      (transactionData) => {
        function getAccountIdFromAccountAndRoutingNumberAndCurrency(
          number?: string | null,
        ) {
          if (number) {
            const [accountNumber, routingNumber, currency] = number.split("/");

            return (
              accounts.find(
                (account) =>
                  account.accountNumber === accountNumber &&
                  account.routingNumber === routingNumber &&
                  account.currency === currency,
              )?.id ?? ""
            );
          }

          return number;
        }

        // fromAccount and toAccount are account numbers with routing numbers instead of IDs
        // because in the seed data, we don't know the IDs
        // so if they are present, we gotta swap them with corresponding IDs
        const fromAccount = getAccountIdFromAccountAndRoutingNumberAndCurrency(
          transactionData.fromAccount,
        );

        const toAccount = getAccountIdFromAccountAndRoutingNumberAndCurrency(
          transactionData.toAccount,
        );

        return PaymentOrderTransaction.parse({
          ...transactionData,
          fromAccount,
          toAccount,
          id: uuidv4(),
          paymentOrderId: paymentOrderId,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      },
    );

    const paymentOrder = PaymentOrder.parse({
      ...paymentOrderData,
      id: paymentOrderId,
      transactions: paymentOrderTransactions.map((pot) => pot.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { paymentOrder, paymentOrderTransactions };
  });

  for (const paymentOrder of data) {
    const foundPaymentOrder = await db.paymentOrders
      .where({ description: paymentOrder.paymentOrder.description })
      .filter(
        (po) =>
          po.transactions.length ===
          paymentOrder.paymentOrder.transactions.length,
      )
      .first();

    if (!foundPaymentOrder) {
      await db.transaction(
        "rw",
        db.paymentOrderTransactions,
        db.paymentOrders,
        async () => {
          await db.paymentOrders.add(paymentOrder.paymentOrder);
          await db.paymentOrderTransactions.bulkAdd(
            paymentOrder.paymentOrderTransactions,
          );
        },
      );
    }
  }
};
