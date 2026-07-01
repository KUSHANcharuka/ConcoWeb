"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AdminProjectWorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f6f4ef] p-6">
      <div className="rounded-[28px] border border-red-200 bg-white p-8 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Projects</p>
          <h1 className="mt-3 font-serif text-4xl text-zinc-950">Workspace failed to load</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            The project workspace hit an unexpected error while loading data for this route.
          </p>
          <div className="mt-6">
            <Button onClick={() => reset()} type="button">
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
