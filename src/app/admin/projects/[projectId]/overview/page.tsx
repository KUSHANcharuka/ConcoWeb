export default function AdminProjectOverviewPage() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
        Overview
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Overview placeholder</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        This route exists so the project workspace has a stable home while billing and
        product-account tabs land in this change. Overview can expand in the next pass
        without changing the project route structure.
      </p>
    </div>
  );
}
