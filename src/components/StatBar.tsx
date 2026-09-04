import clsx from "clsx";
import { formatGBP } from "@/lib/format";

const COLOR_MAP = {
  blue: "bg-blue-600",
  green: "bg-emerald-600",
  purple: "bg-purple-700",
  amber: "bg-amber-600",
} as const;

export function StatBar({
  label,
  amount,
  color,
}: {
  label: string;
  amount: number;
  color: keyof typeof COLOR_MAP;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between rounded-xl px-4 py-3 text-white shadow-sm",
        COLOR_MAP[color]
      )}
    >
      <span className="font-semibold tracking-wide">{label}</span>
      <span className="text-lg font-bold tabular-nums">{formatGBP(amount)}</span>
    </div>
  );
}
