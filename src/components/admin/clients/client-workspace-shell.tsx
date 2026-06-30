"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ChevronRightIcon,
  CreditCardIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from "lucide-react";

import { ClientBrandMedia } from "~/components/clients/client-brand-media";
import { ClientStatusBadge } from "~/components/clients/client-status-badge";
import { cn } from "@/lib/utils";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

type ClientWorkspaceShellProps = {
  client: {
    id: string;
    name: string;
    status: "lead" | "active" | "suspended" | "archived";
    primaryContactEmail: string;
    primaryContactPhone: string | null;
    baseCurrency: string;
    projectCount: number;
    activeMemberCount: number;
    pendingInviteCount: number;
    coverUrl: string | null;
    logoUrl: string | null;
  };
  children: ReactNode;
};

const sectionItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboardIcon },
  { key: "members", label: "Members", icon: UsersIcon },
  { key: "projects", label: "Projects", icon: FolderKanbanIcon },
  { key: "billing", label: "Billing", icon: CreditCardIcon },
] as const;

export function ClientWorkspaceShell({ client, children }: ClientWorkspaceShellProps) {
  const pathname = usePathname();
  const [uploadingKind, setUploadingKind] = useState<"cover" | "logo" | null>(null);
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const clientQuery = api.admin.clients.context.useQuery(
    { clientId: client.id },
    { initialData: client },
  );
  const createBrandUpload = api.admin.clients.createBrandUpload.useMutation();
  const completeBrandUpload = api.admin.clients.completeBrandUpload.useMutation();
  const currentClient = clientQuery.data ?? client;

  async function uploadBrand(kind: "cover" | "logo", file: File) {
    const tracker = uploadProgress.startUpload({ label: file.name });
    try {
      setUploadingKind(kind);
      const prepared = await createBrandUpload.mutateAsync({
        clientId: currentClient.id,
        kind,
        fileName: file.name,
        mimeType: file.type || "image/png",
        sizeBytes: file.size,
      });

      await uploadWithProgress({
        url: prepared.uploadUrl,
        file,
        contentType: file.type || "application/octet-stream",
        onProgress: tracker.update,
      });

      await completeBrandUpload.mutateAsync({
        clientId: currentClient.id,
        kind,
        assetId: prepared.assetId,
      });

      await Promise.all([
        utils.admin.clients.context.invalidate({ clientId: currentClient.id }),
        utils.admin.clients.getById.invalidate({ clientId: currentClient.id }),
      ]);
      tracker.succeed(kind === "cover" ? "Cover updated" : "Logo updated");
      toast.success(kind === "cover" ? "Cover updated." : "Logo updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Failed to update client ${kind}.`;
      tracker.fail(message);
      toast.error(message);
    } finally {
      setUploadingKind(null);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f6f4ef]">
      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-r border-black/5 bg-[#f1eee7] p-5">
          <div className="group overflow-hidden border border-black/5 bg-white">
            <ClientBrandMedia
              coverUploading={uploadingKind === "cover"}
              coverUrl={currentClient.coverUrl}
              logoUploading={uploadingKind === "logo"}
              logoUrl={currentClient.logoUrl}
              name={currentClient.name}
              onCoverSelected={(file) => uploadBrand("cover", file)}
              onLogoSelected={(file) => uploadBrand("logo", file)}
            />
            <div className="space-y-4 p-5">
              <div className="grid gap-2 text-sm text-zinc-600">
                <div>{currentClient.primaryContactEmail}</div>
                <div>{currentClient.primaryContactPhone ?? "No phone set"}</div>
              </div>
              <div className="flex items-center gap-2">
                <ClientStatusBadge status={currentClient.status} />
                <span className="border border-black/10 px-2.5 py-1 text-xs text-zinc-500">
                  {currentClient.baseCurrency}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border border-zinc-200 p-3 text-center text-xs">
                <div>
                  <div className="text-zinc-400">Members</div>
                  <div className="mt-1 font-semibold text-zinc-900">{currentClient.activeMemberCount}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Invites</div>
                  <div className="mt-1 font-semibold text-zinc-900">{currentClient.pendingInviteCount}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Projects</div>
                  <div className="mt-1 font-semibold text-zinc-900">{currentClient.projectCount}</div>
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {sectionItems.map((item) => {
              const href = `/admin/clients/${currentClient.id}/${item.key}`;
              const active = pathname === href;
              const Icon = item.icon;
              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950",
                  )}
                  href={href}
                  key={item.key}
                >
                  <Icon className="size-4" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRightIcon className="size-4 text-zinc-400" />
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 p-6">
          <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
            <Link className="hover:text-zinc-900" href="/admin/clients">
              Clients
            </Link>
            <ChevronRightIcon className="size-4" />
            <span>{currentClient.name}</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export function ClientSectionSurface({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{eyebrow}</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function ClientWorkspaceEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-zinc-300 bg-white p-8">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        <p className="text-sm leading-7 text-zinc-600">{description}</p>
      </div>
      {action ? <div className="mt-6 flex gap-3">{action}</div> : null}
    </div>
  );
}
