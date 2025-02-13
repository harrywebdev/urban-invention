import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { Currency, MoneyAmount } from "@/data/types";
import { AccountType } from "@/data/account.types";
import AccountIcon, { getAccountColorClass } from "@/components/AccountIcon";

interface AccountCardProps {
  name: string;
  accountNumber: string;
  routingNumber: string;
  type: AccountType;
  currency: Currency;
  balance: MoneyAmount;
  creditLimit?: MoneyAmount;
}

export function AccountCard({
  name,
  accountNumber,
  routingNumber,
  type,
  currency,
  balance,
  creditLimit,
}: AccountCardProps) {
  return (
    <Card className={`w-full ${getAccountColorClass(type)}`}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center text-neutral-900 dark:text-neutral-50 gap-1.5 whitespace-nowrap overflow-hidden min-w-0 text-ellipsis">
          <AccountIcon accountType={type} />

          {name}
        </CardTitle>

        <CardDescription>
          {accountNumber}/{routingNumber}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p
          className={`text-2xl font-bold ${balance < 0 ? "text-red-500" : "text-green-500"}`}
        >
          {formatMoney(balance, currency)}
        </p>

        {type === AccountType.enum.credit_card && creditLimit && (
          <p className="text-sm text-muted-foreground">
            Limit: {formatMoney(creditLimit, currency)}
          </p>
        )}
      </CardContent>

      {/*<CardFooter>*/}
      {/*  <p className="text-sm text-gray-500">Last transaction: TODO</p>*/}
      {/*</CardFooter>*/}
    </Card>
  );
}
