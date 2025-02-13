import { FC } from "react";
import { AccountType } from "@/data/account.types";
import {
  CoinsIcon,
  CreditCardIcon,
  LandmarkIcon,
  WalletIcon,
} from "lucide-react";

type AccountIconProps = {
  accountType?: AccountType;
};

const AccountIcon: FC<AccountIconProps> = ({ accountType }) => {
  if (!accountType) {
    return null;
  }

  switch (accountType) {
    case "debit":
      return (
        <span className={"shrink-0"}>
          <LandmarkIcon className={"w-4 h-4"} />
        </span>
      );

    case "savings":
      return (
        <span className={"shrink-0"}>
          <CoinsIcon className={"w-4 h-4"} />
        </span>
      );

    case "credit_card":
      return (
        <span className={"shrink-0"}>
          <CreditCardIcon className={"w-4 h-4"} />
        </span>
      );

    case "prepaid_card":
      return (
        <span className={"shrink-0"}>
          <WalletIcon className={"w-4 h-4"} />
        </span>
      );
  }
};

export default AccountIcon;

export function getAccountColorClass(accountType?: AccountType) {
  if (!accountType) {
    return "";
  }

  switch (accountType) {
    case "debit":
      return "bg-neutral-50/50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700";

    case "savings":
      return "bg-emerald-100/50 dark:bg-emerald-700 border-emerald-200 dark:border-emerald-700";

    case "credit_card":
      return "bg-amber-100/50 dark:bg-amber-700 border-amber-200 dark:border-amber-700";

    case "prepaid_card":
      return "bg-blue-100/50 dark:bg-blue-700 border-blue-200 dark:border-blue-700";
  }
}
