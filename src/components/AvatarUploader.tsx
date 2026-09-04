"use client";

import { useRef, useState, useTransition } from "react";
import { updateAvatar, removeAvatar } from "@/lib/actions";

const AVATAR_SIZE = 256;

export function AvatarUploader({
  defaultAvatar,
  username,
}: {
  defaultAvatar: string | null;
  username: string;
}) {
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    let dataUrl: string;
    try {
      dataUrl = await resizeToSquareDataUrl(file, AVATAR_SIZE);
    } catch {
      setError("Couldn't read that image.");
      return;
    }

    setAvatar(dataUrl);
    startTransition(async () => {
      const result = await updateAvatar(dataUrl);
      if (!result.ok) setError(result.error ?? "Couldn't save that image.");
    });
  }

  function handleRemove() {
    setAvatar(null);
    setError(null);
    startTransition(async () => {
      await removeAvatar();
    });
  }

  const initial = username.slice(0, 1).toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 text-2xl font-semibold text-teal-700 dark:bg-teal-900 dark:text-teal-200">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="rounded-full bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {avatar ? "Change picture" : "Upload picture"}
          </button>
          {avatar && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-300"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <p className="text-xs text-slate-400">JPG, PNG, or GIF. Square works best.</p>
      </div>
    </div>
  );
}

// Resizes and centre-crops the image to a square in the browser before it's
// ever sent to the server, so we're not storing arbitrarily large uploads.
function resizeToSquareDataUrl(file: File, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("no canvas context"));
          return;
        }

        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
