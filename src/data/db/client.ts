import Dexie, { type EntityTable } from "dexie";
import { Transaction } from "@/data/types/transaction.types";
import { Account } from "@/data/types/account.types";
import { PaymentOrder } from "@/data/types/payment-order.types";
import { PaymentOrderTransaction } from "@/data/types/payment-order-transaction.types";
import { Scenario } from "@/data/types/scenario.types";

const client = new Dexie("VrazovkaFinDb") as Dexie & {
  scenarios: EntityTable<Scenario, "id">;
  accounts: EntityTable<
    Account,
    "id" // primary key "id" (for the typings only)
  >;
  transactions: EntityTable<Transaction, "id">;
  paymentOrders: EntityTable<PaymentOrder, "id">;
  paymentOrderTransactions: EntityTable<PaymentOrderTransaction, "id">;
};

// Schema declaration:
client.version(1).stores({
  scenarios: "id, name",
  accounts:
    "id, name, [accountNumber+routingNumber], iban, type, balance, currency, creditLimit, sequence",
  transactions:
    "id, date, amount, currency, description, type, fromAccount, toAccount",
  paymentOrders:
    "id, scenarioId, description, validFrom, triggerOn, *transactions",
  paymentOrderTransactions:
    "id, paymentOrderId, date, amount, currency, description, type, fromAccount, toAccount",
});

export { client };
