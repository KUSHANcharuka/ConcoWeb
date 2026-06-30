import { FolderOpenDot } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProjectEmptyState({
  onCreate,
  hasFilters,
}: {
  onCreate: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
        <FolderOpenDot className="size-6" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-zinc-900">
        {hasFilters ? "No projects match these filters." : "No projects yet."}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
        {hasFilters
          ? "Adjust the search or filter values to widen the result set."
          : "Create the first client-facing project workspace here. New projects are visible in the client portal as soon as they are created."}
      </p>
      {!hasFilters && (
        <Button className="mt-6" onClick={onCreate} type="button">
          New Project
        </Button>
      )}
    </div>
  );
}
