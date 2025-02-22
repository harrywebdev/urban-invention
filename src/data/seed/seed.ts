import { v4 as uuidv4 } from "uuid";
import { client } from "@/data/db/client";
import { Account } from "@/data/types/account.types";
import { PaymentOrder } from "@/data/types/payment-order.types";
import { PaymentOrderId } from "@/data/types/types";
import { PaymentOrderTransaction } from "@/data/types/payment-order-transaction.types";

// seed Scenarios
// format:
// [
//   {
//     "id": "",
//     "name": "",
//   }
// ]
// see ../scenario.types.ts for type definition
export const seedScenarios = async () => {
  const scenariosData = (await import("./scenarios.json")).default;

  const data = scenariosData.map((scenarioData) => ({
    ...scenarioData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  for (const scenario of data) {
    const foundScenario = await client.scenarios
      .where({ name: scenario.name })
      .first();

    if (!foundScenario) {
      await client.scenarios.add(scenario);
    }
  }
};

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
    const foundAccount = await client.accounts
      .where({
        accountNumber: account.accountNumber,
        routingNumber: account.routingNumber,
      })
      .filter((a) => a.currency === account.currency)
      .first();

    if (!foundAccount) {
      await client.accounts.add(account);
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

type PaymentOrdersSeedData = {
  paymentOrder: PaymentOrder;
  paymentOrderTransactions: PaymentOrderTransaction[];
}[];

export const seedPaymentOrders = async () => {
  const paymentOrdersData = (await import("./payment-orders.json")).default;

  // get all the accounts for the transactions
  const accounts = await client.accounts.toArray();

  // get all scenarios - and seed these POs for all scenarios for now
  const scenarios = await client.scenarios.toArray();

  const data: PaymentOrdersSeedData = paymentOrdersData.reduce(
    (acc, paymentOrderData) => {
      scenarios.forEach((scenario) => {
        const paymentOrderId = PaymentOrderId.parse(uuidv4());

        const paymentOrderTransactions = paymentOrderData.transactions.map(
          (transactionData) => {
            function getAccountIdFromAccountAndRoutingNumberAndCurrency(
              number?: string | null,
            ) {
              if (number) {
                const [accountNumber, routingNumber, currency] =
                  number.split("/");

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
            const fromAccount =
              getAccountIdFromAccountAndRoutingNumberAndCurrency(
                transactionData.fromAccount,
              );

            const toAccount =
              getAccountIdFromAccountAndRoutingNumberAndCurrency(
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
          scenarioId: scenario.id,
          transactions: paymentOrderTransactions.map((pot) => pot.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        acc.push({ paymentOrder, paymentOrderTransactions });
      });

      return acc;
    },
    [] as PaymentOrdersSeedData,
  );

  for (const paymentOrder of data) {
    const foundPaymentOrder = await client.paymentOrders
      .where({
        description: paymentOrder.paymentOrder.description,
      })
      .filter(
        (po) =>
          po.transactions.length ===
            paymentOrder.paymentOrder.transactions.length &&
          po.scenarioId === paymentOrder.paymentOrder.scenarioId,
      )
      .first();

    if (!foundPaymentOrder) {
      await client.transaction(
        "rw",
        client.paymentOrderTransactions,
        client.paymentOrders,
        async () => {
          await client.paymentOrders.add(paymentOrder.paymentOrder);
          await client.paymentOrderTransactions.bulkAdd(
            paymentOrder.paymentOrderTransactions,
          );
        },
      );
    }
  }
};
