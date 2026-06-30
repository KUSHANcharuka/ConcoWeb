import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminProjectWorkspaceNotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f6f4ef] p-6">
      <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Projects</p>
          <h1 className="mt-3 font-serif text-4xl text-zinc-950">Project not found</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            The project you tried to open does not exist or is no longer available in this admin workspace.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/admin/projects">Back to projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
