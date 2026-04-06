import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { SensorReading } from "@/lib/thingspeak";

interface SensorChartProps {
  data: SensorReading[];
  dataKey: "temperature" | "aqi";
  title: string;
  color: string;
  unit: string;
}

export function SensorChart({ data, dataKey, title, color, unit }: SensorChartProps) {
  const chartData = data.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [dataKey]: Math.round(r[dataKey] * 10) / 10,
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-slide-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="hsl(215 12% 40%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="hsl(215 12% 40%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(v) => `${v}${unit}`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(220 18% 12%)",
                border: "1px solid hsl(220 14% 20%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210 20% 92%)",
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${dataKey})`}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
