"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatGBP } from "@/lib/format";

export interface TrendPoint {
  label: string;
  startWith: number;
  outgoings: number;
  remaining: number;
}

const COLORS = {
  startWith: "#2563eb",
  outgoings: "#d97706",
  remaining: "#7e22ce",
};

const TOOLTIP_STYLE = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 13,
  color: "var(--foreground)",
};

export function TrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return <p className="py-16 text-center text-sm text-slate-400">No months in this range yet.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#898781" }} stroke="#898781" />
          <YAxis
            tick={{ fontSize: 12, fill: "#898781" }}
            stroke="#898781"
            tickFormatter={(v: number) => `£${v}`}
            width={60}
          />
          <Tooltip formatter={(value) => formatGBP(Number(value))} contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Line
            type="monotone"
            dataKey="startWith"
            name="Start With"
            stroke={COLORS.startWith}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="outgoings"
            name="Outgoings"
            stroke={COLORS.outgoings}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="remaining"
            name="Remaining"
            stroke={COLORS.remaining}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
