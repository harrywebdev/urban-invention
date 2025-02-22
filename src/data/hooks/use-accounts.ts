import { useLiveQuery } from "dexie-react-hooks";
import { AccountId, Currency } from "@/data/types/types";
import { client } from "@/data/db/client";
import { Account } from "@/data/types/account.types";
import { useMemo } from "react";

export function useAccounts(accountIds?: AccountId[]): {
  data: Account[];
  isLoading: boolean;
} {
  const accounts = useLiveQuery(
    () =>
      accountIds
        ? client.accounts.bulkGet(accountIds)
        : client.accounts.toArray(),
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

export const createAccount = async (data: Account) => client.accounts.add(data);

type UseAccountsForPickerProps = {
  limitByCurrency?: Currency;
  ignoreAccountId?: AccountId;
};

export const useAccountsForPicker = ({
  limitByCurrency,
  ignoreAccountId,
}: UseAccountsForPickerProps) => {
  return useLiveQuery(async () => {
    const records = await (limitByCurrency
      ? client.accounts.where("currency").equals(limitByCurrency).toArray()
      : client.accounts.toArray());

    if (ignoreAccountId) {
      return records.filter((account) => account.id !== ignoreAccountId);
    }

    return records;
  }, [limitByCurrency, ignoreAccountId]);
};
