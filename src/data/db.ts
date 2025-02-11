import Dexie, { type EntityTable } from "dexie";
import { Account, Transaction } from "@/data/types";

const db = new Dexie("VrazovkaFinDb") as Dexie & {
  accounts: EntityTable<
    Account,
    "id" // primary key "id" (for the typings only)
  >;
  transactions: EntityTable<Transaction, "id">;
};

// Schema declaration:
db.version(1).stores({
  accounts:
    "++id, name, accountNumber, routingNumber, type, balance, currency, *transactions, creditLimit",
  transactions:
    "++id, date, amount, currency, description, type, fromAccount, toAccount",
});

export { db };
