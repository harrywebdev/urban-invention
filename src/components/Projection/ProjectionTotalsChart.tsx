import { FC, useMemo } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/utils";
import { Currency, MoneyAmount } from "@/data/types/types";
import { Transaction } from "@/data/types/transaction.types";
import { calculateTransactionBalance } from "@/lib/calc";

type ProjectionTotalsChartProps = {
  transactions: Transaction[];
  accountsBalance: MoneyAmount;
};

const chartConfig = {
  balance: {
    label: "Balance",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type ChartData = {
  month: string;
  balance: number;
}[];

const ProjectionTotalsChart: FC<ProjectionTotalsChartProps> = ({
  transactions,
  accountsBalance,
}) => {
  const chartData: ChartData = useMemo(() => {
    // first, group transactions by month like YYYY-MM
    // and then calculate the balance for each month
    const groupedByMonth = transactions.reduce(
      (acc, tx) => {
        const month = tx.date.toISOString().slice(0, 7);

        if (!acc[month]) {
          acc[month] = {
            month,
            txs: [],
          };
        }

        acc[month].txs.push(tx);

        return acc;
      },
      {} as Record<string, { txs: Transaction[]; month: string }>,
    );

    return Object.values(groupedByMonth).reduce((acc, txs) => {
      const startingBalance = acc[acc.length - 1]?.balance ?? accountsBalance;

      acc.push({
        month: txs.month,
        balance: calculateTransactionBalance(startingBalance, txs.txs).balance,
      });

      return acc;
    }, [] as ChartData);
  }, [transactions, accountsBalance]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={30}
          axisLine={true}
          tickFormatter={(value) => value}
          angle={-90}
          height={60}
        />

        <YAxis
          dataKey={"balance"}
          width={100}
          tickLine={false}
          tickMargin={0}
          axisLine={false}
          tickFormatter={(value) => formatMoney(value, Currency.enum.CZK)}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) =>
                formatMoney(Number(value), Currency.enum.CZK)
              }
            />
          }
        />

        <Line dataKey="balance" fill="var(--color-balance)" radius={4} />
      </LineChart>
    </ChartContainer>
  );
};

export default ProjectionTotalsChart;
