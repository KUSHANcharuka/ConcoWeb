import Link from "next/link";

export default function ClientPortalNoAccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f4ef] p-10">
      <div className="w-full max-w-xl space-y-4 border border-zinc-200 bg-white p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Client Portal Access
        </p>
        <h1 className="font-serif text-3xl text-zinc-950">No active client organization.</h1>
        <p className="text-sm leading-7 text-zinc-600">
          Sign in with an invited client account and make sure your active Clerk organization is the client company you want to view.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link className="border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50" href="/client-portal/access?mode=guest">
            Continue as guest
          </Link>
          <Link className="border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50" href="/">
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
