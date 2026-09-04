import clsx from "clsx";

export function StatTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={clsx(
          "mt-1 text-2xl font-bold tabular-nums",
          tone === "positive" && "text-emerald-600",
          tone === "negative" && "text-red-500"
        )}
      >
        {value}
      </p>
    </div>
  );
}
