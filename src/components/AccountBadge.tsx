import { FC } from "react";
import { formatAccountNumber } from "@/lib/utils";
import { CircleArrowRightIcon } from "lucide-react";
import { Account } from "@/data/types/account.types";
import AccountIcon, { getAccountColorClass } from "@/components/AccountIcon";

type AccountBadgeProps = {
  account?: Account;
  transferIcon?: "to" | "from";
};

const AccountBadge: FC<AccountBadgeProps> = ({ account, transferIcon }) => {
  if (!account) {
    return null;
  }

  const transferIconClass =
    transferIcon === "to"
      ? "pl-1 mx-2"
      : transferIcon === "from"
        ? "pr-2 mx-2"
        : "";

  return (
    <span
      className={`flex flex-row border rounded-md shadow-sm  ${getAccountColorClass(account.type)} ${transferIconClass} relative`}
    >
      <span className={"flex flex-col gap-1 px-3 py-2"}>
        <span
          className={
            "flex items-center text-neutral-900 dark:text-neutral-50 gap-1.5 whitespace-nowrap"
          }
        >
          <AccountIcon accountType={account.type} />

          <span className="font-medium text-base">{account.name}</span>
        </span>

        <span className={"text-sm text-neutral-500 dark:text-neutral-400"}>
          {formatAccountNumber(account)}
        </span>
      </span>

      {transferIcon === "from" && (
        <span
          className={
            "flex items-center justify-center text-white absolute top-1/2 -right-3 -translate-y-1/2"
          }
        >
          {/* fill="red-500" */}
          <CircleArrowRightIcon className={"w-6 h-6"} fill={"#ef4444"} />
        </span>
      )}

      {transferIcon === "to" && (
        <span
          className={
            "flex items-center justify-center text-white absolute top-1/2 -left-3 -translate-y-1/2"
          }
        >
          {/* fill="emerald-500" */}
          <CircleArrowRightIcon className={"w-6 h-6"} fill={"#10b981"} />
        </span>
      )}
    </span>
  );
};

export default AccountBadge;
