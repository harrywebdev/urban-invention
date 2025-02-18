import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatMoney } from "@/lib/utils";
import { Currency, MoneyAmount } from "@/data/types/types";
import { AccountType } from "@/data/types/account.types";
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
  // balance,
  creditLimit,
}: AccountCardProps) {
  return (
    <Card className={`w-full ${getAccountColorClass(type)}`}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center text-neutral-900 dark:text-neutral-50 gap-1.5 whitespace-nowrap overflow-hidden min-w-0 text-ellipsis">
          <AccountIcon accountType={type} />
          {name}{" "}
          {currency !== Currency.enum.CZK ? (
            <span className={"text-neutral-400"}>
              ({formatCurrency(currency)})
            </span>
          ) : null}
        </CardTitle>

        <CardDescription>
          {accountNumber}/{routingNumber}
        </CardDescription>
      </CardHeader>

      {/*<p*/}
      {/*  className={`text-2xl font-bold ${balance < 0 ? "text-red-500" : "text-green-500"}`}*/}
      {/*>*/}
      {/*  {formatMoney(balance, currency)}*/}
      {/*</p>*/}

      {type === AccountType.enum.credit_card && creditLimit && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Limit: {formatMoney(creditLimit, currency)}
          </p>
        </CardContent>
      )}

      {/*<CardFooter>*/}
      {/*  <p className="text-sm text-gray-500">Last transaction: TODO</p>*/}
      {/*</CardFooter>*/}
    </Card>
  );
}
