"use client";

import { useEffect, useRef, useState } from "react";
import { getEntryIcon } from "@/lib/entry-icon";

export function EntryIcon({ name }: { name: string }) {
  const icon = getEntryIcon(name);
  const [faviconFailed, setFaviconFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The browser can start loading (and fail) a server-rendered <img> before
  // React hydrates and attaches the onError handler below, in which case
  // the error event fires with nobody listening. Catch that race on mount.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) {
      setFaviconFailed(true);
    }
  }, []);

  if (icon.kind === "favicon" && !faviconFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
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
