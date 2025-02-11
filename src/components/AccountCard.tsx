import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import { AccountType, Currency, MoneyAmount } from "@/data/types";

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge
            variant={
              type === AccountType.enum.credit_card ? "destructive" : "default"
            }
          >
            {type}
          </Badge>
        </div>
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
            Credit Limit: ${formatMoney(creditLimit, currency)}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-sm text-gray-500">Last transaction: TODO</p>
      </CardFooter>
    </Card>
  );
}
