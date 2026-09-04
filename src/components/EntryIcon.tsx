"use client";

import { useState } from "react";
import { getEntryIcon } from "@/lib/entry-icon";

export function EntryIcon({ name }: { name: string }) {
  const icon = getEntryIcon(name);
  const [faviconFailed, setFaviconFailed] = useState(false);

  if (icon.kind === "favicon" && !faviconFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://www.google.com/s2/favicons?domain=${icon.domain}&sz=64`}
        alt=""
        className="h-5 w-5 shrink-0 rounded-sm"
        onError={() => setFaviconFailed(true)}
      />
    );
  }

  const emoji = icon.kind === "favicon" ? icon.fallback : icon.value;
  return (
    <span className="w-5 shrink-0 text-center text-base leading-none" aria-hidden>
      {emoji}
    </span>
  );
}
