import { useLiveQuery } from "dexie-react-hooks";
import { AccountId } from "@/data/types/types";
import { db } from "@/data/db";
import { Account } from "@/data/types/account.types";
import { useMemo } from "react";

export function useAccounts(accountIds: AccountId[]): {
  data: Account[];
  isLoading: boolean;
} {
  const accounts = useLiveQuery(
    () => db.accounts.bulkGet(accountIds),
    [accountIds],
  );

  const resultAccounts = useMemo(() => {
    const onlyFoundAccounts: Account[] = (accounts?.filter(Boolean) ??
      []) as Account[];

    return onlyFoundAccounts.sort((a, b) => {
      return a.sequence - b.sequence;
    });
  }, [accounts]);

  return { data: resultAccounts, isLoading: accounts === undefined };
}
