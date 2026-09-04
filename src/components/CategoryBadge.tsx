export function CategoryBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {name}
    </span>
  );
}
