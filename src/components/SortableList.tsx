"use client";

import { useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

interface Identifiable {
  id: string;
}

// A drag-to-reorder list. Outside `reordering` mode it just renders each
// item plainly (so clicks/taps behave normally); switching into reordering
// mode swaps in a drag handle per row and calls `onReorder` with the new id
// order as soon as a drag finishes, so the caller can persist it.
export function SortableList<T extends Identifiable>({
  items,
  reordering,
  onReorder,
  renderItem,
}: {
  items: T[];
  reordering: boolean;
  onReorder: (orderedIds: string[]) => void;
  renderItem: (item: T) => ReactNode;
}) {
  const [localItems, setLocalItems] = useState(items);
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setLocalItems(items);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localItems.findIndex((i) => i.id === active.id);
    const newIndex = localItems.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(reordered);
    onReorder(reordered.map((i) => i.id));
  }

  if (!reordering) {
    return <>{localItems.map((item) => renderItem(item))}</>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={localItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {localItems.map((item) => (
          <SortableRow key={item.id} id={item.id}>
            {renderItem(item)}
          </SortableRow>
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={clsx("flex items-center gap-1", isDragging && "z-10 opacity-60")}>
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab touch-none px-1.5 py-2.5 text-slate-300 hover:text-slate-500 active:cursor-grabbing dark:text-slate-600 dark:hover:text-slate-400"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
