import { FC } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/lib/utils";
import { Currency } from "@/data/types/types";

type ProjectionTotalsChartProps = {
  //
};
const chartData = [
  { month: "2025-01", balance: 186 },
  { month: "2025-02", balance: 305 },
  { month: "2025-03", balance: 537 },
  { month: "2025-04", balance: 730 },
  { month: "2025-05", balance: 2090 },
  { month: "2025-06", balance: 21400 },
];

const chartConfig = {
  balance: {
    label: "Balance",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const ProjectionTotalsChart: FC<ProjectionTotalsChartProps> = () => {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />

        <YAxis
          dataKey={"balance"}
          tickLine={false}
          tickMargin={10}
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
