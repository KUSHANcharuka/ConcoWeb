"use client";

import { useRef } from "react";
import { ImagePlusIcon, LoaderCircleIcon, PencilIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ClientBrandMediaProps = {
  name: string;
  coverUrl: string | null;
  logoUrl: string | null;
  coverUploading?: boolean;
  logoUploading?: boolean;
  onCoverSelected?: (file: File) => void | Promise<void>;
  onLogoSelected?: (file: File) => void | Promise<void>;
};

export function ClientBrandMedia({
  name,
  coverUrl,
  logoUrl,
  coverUploading = false,
  logoUploading = false,
  onCoverSelected,
  onLogoSelected,
}: ClientBrandMediaProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="relative flex min-h-52 items-end justify-between overflow-hidden bg-[linear-gradient(135deg,rgba(255,245,157,0.95),rgba(255,255,255,0.95))] p-5">
      {coverUrl ? (
        <img
          alt={`${name} cover`}
          className="absolute inset-0 h-full w-full object-cover"
          src={coverUrl}
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(17,24,39,0.12))]" />

      <div className="relative z-10 space-y-2">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-600">Client</div>
        <div className="font-serif text-3xl leading-tight text-zinc-950">{name}</div>
      </div>

      <div className="relative z-10">
        {logoUrl ? (
          <img
            alt={`${name} logo`}
            className="h-16 w-16 border border-black/10 bg-white object-cover"
            src={logoUrl}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center border border-black/10 bg-white text-sm font-semibold text-zinc-900">
            {initials}
          </div>
        )}
      </div>

      {onCoverSelected ? (
        <>
          <input
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void onCoverSelected(file);
              }
              event.currentTarget.value = "";
            }}
            ref={coverInputRef}
            type="file"
          />
          <button
            className={cn(
              "absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border border-black/10 bg-white/92 text-zinc-900 opacity-0 transition group-hover:opacity-100 hover:bg-white",
              coverUploading ? "opacity-100" : "",
            )}
            disabled={coverUploading}
            onClick={() => coverInputRef.current?.click()}
            type="button"
          >
            {coverUploading ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              <PencilIcon className="size-4" />
            )}
          </button>
        </>
      ) : null}

      {onLogoSelected ? (
        <>
          <input
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void onLogoSelected(file);
              }
              event.currentTarget.value = "";
            }}
            ref={logoInputRef}
            type="file"
          />
          <button
            className={cn(
              "absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center border border-black/10 bg-white/92 text-zinc-900 opacity-0 transition group-hover:opacity-100 hover:bg-white",
              logoUploading ? "opacity-100" : "",
            )}
            disabled={logoUploading}
            onClick={() => logoInputRef.current?.click()}
            type="button"
          >
            {logoUploading ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              <ImagePlusIcon className="size-4" />
            )}
          </button>
        </>
      ) : null}
    </div>
  );
}
