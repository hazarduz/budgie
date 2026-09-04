"use client";

import { useState, useTransition } from "react";
import { createCategory, deleteCategory, updateCategory } from "@/lib/actions";
import type { PlainCategory } from "@/lib/serialize";

const SWATCHES = [
  "#0d9488",
  "#2563eb",
  "#16a34a",
  "#c026d3",
  "#ea580c",
  "#dc2626",
  "#0891b2",
  "#ca8a04",
  "#64748b",
];

export function CategoryManager({ categories }: { categories: PlainCategory[] }) {
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(SWATCHES[0]);

  function addCategory() {
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      await createCategory(name, newColor);
      setNewName("");
    });
  }

  return (
    <div className="space-y-4">
      <div className="card divide-y divide-[var(--border)]">
        {categories.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">No categories yet.</p>
        ) : (
          categories.map((c) => <CategoryRow key={c.id} category={c} />)
        )}
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="New category name"
          className="min-w-[10rem] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <div className="flex gap-1.5">
          {SWATCHES.map((color) => (
            <button
              key={color}
              onClick={() => setNewColor(color)}
              className="h-6 w-6 rounded-full ring-offset-2"
              style={{
                backgroundColor: color,
                outline: newColor === color ? `2px solid ${color}` : undefined,
                outlineOffset: 2,
              }}
              aria-label={color}
            />
          ))}
        </div>
        <button
          onClick={addCategory}
          disabled={isPending || !newName.trim()}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          Add category
        </button>
      </div>
    </div>
  );
}

function CategoryRow({ category }: { category: PlainCategory }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);

  function save() {
    if (!name.trim()) return;
    startTransition(async () => {
      await updateCategory(category.id, name.trim(), color);
      setEditing(false);
    });
  }

  function remove() {
    if (!confirm(`Delete category "${category.name}"? Entries keep their amounts but lose this tag.`))
      return;
    startTransition(() => deleteCategory(category.id));
  }

  if (editing) {
    return (
      <div className="flex flex-wrap items-center gap-3 p-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-w-[8rem] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-teal-500"
        />
        <div className="flex gap-1.5">
          {SWATCHES.map((sw) => (
            <button
              key={sw}
              onClick={() => setColor(sw)}
              className="h-6 w-6 rounded-full"
              style={{
                backgroundColor: sw,
                outline: color === sw ? `2px solid ${sw}` : undefined,
                outlineOffset: 2,
              }}
              aria-label={sw}
            />
          ))}
        </div>
        <button
          onClick={save}
          disabled={isPending}
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 p-3">
      <div className="flex items-center gap-2.5">
        <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: category.color }} />
        <span className="font-medium">{category.name}</span>
      </div>
      <div className="flex gap-3 text-sm">
        <button onClick={() => setEditing(true)} className="font-medium text-teal-700 hover:underline dark:text-teal-300">
          Edit
        </button>
        <button onClick={remove} disabled={isPending} className="font-medium text-red-600 hover:underline disabled:opacity-50">
          Delete
        </button>
      </div>
    </div>
  );
}
