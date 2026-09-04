"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatGBP } from "@/lib/format";

export interface BreakdownItem {
  name: string;
  color: string;
  total: number;
}

const TOOLTIP_STYLE = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 13,
  color: "var(--foreground)",
};

export function BreakdownChart({ data, emptyLabel }: { data: BreakdownItem[]; emptyLabel: string }) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">{emptyLabel}</p>;
  }

  const height = Math.max(100, data.length * 36 + 16);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 56, left: 8, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 12, fill: "#898781" }}
            stroke="#898781"
          />
          <Tooltip formatter={(value) => formatGBP(Number(value))} contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
            <LabelList
              dataKey="total"
              position="right"
              formatter={(v: unknown) => formatGBP(Number(v))}
              style={{ fontSize: 12, fill: "var(--foreground)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
