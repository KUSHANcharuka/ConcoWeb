"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  Clock3Icon,
  ExternalLinkIcon,
  LoaderCircleIcon,
  PlusIcon,
  PlugZapIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

function nextDefaultExpiry() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  date.setMinutes(0, 0, 0);
  return formatDateTimeInput(date);
}

export function ProductAccessPageClient({ projectId }: { projectId: string }) {
  const utils = api.useUtils();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [createMode, setCreateMode] = useState(false);
  const [productName, setProductName] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productKind, setProductKind] = useState<"saas" | "custom" | "service">("custom");
  const [productBillingMode, setProductBillingMode] = useState<
    "subscription" | "one_time" | "milestone" | "manual"
  >("manual");
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [grantExpiry, setGrantExpiry] = useState(nextDefaultExpiry);
  const [extendExpiry, setExtendExpiry] = useState(nextDefaultExpiry);
  const [revokeReason, setRevokeReason] = useState("");

  const accessQuery = api.admin.productAccess.byProject.useQuery({ projectId });
  const productsQuery = api.admin.products.options.useQuery();
  const linkProductMutation = api.admin.projects.linkProduct.useMutation({
    onSuccess: async () => {
      await invalidateProductAccess(utils, projectId);
      await Promise.all([
        utils.admin.projects.byId.invalidate({ projectId }),
        utils.admin.projectWorkspace.context.invalidate({ projectId }),
      ]);
      toast.success("Product linked to project.");
      closeLinkDialog();
    },
    onError: (error) => toast.error(error.message),
  });
  const createProductMutation = api.admin.products.create.useMutation({
    onSuccess: async (createdProduct) => {
      await Promise.all([
        utils.admin.products.options.invalidate(),
        utils.admin.settingsBilling.webhooks.invalidate(),
        utils.admin.settingsBilling.page.invalidate(),
      ]);
      await linkProductMutation.mutateAsync({
        projectId,
        productId: createdProduct.id,
      });
    },
    onError: (error) => toast.error(error.message),
  });
  const grantMutation = api.admin.productAccess.grant.useMutation({
    onSuccess: async () => {
      await invalidateProductAccess(utils, projectId);
      toast.success("Product access granted.");
      setGrantDialogOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });
  const extendMutation = api.admin.productAccess.extend.useMutation({
    onSuccess: async () => {
      await invalidateProductAccess(utils, projectId);
      toast.success("Product access extended.");
      setExtendDialogOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });
  const revokeMutation = api.admin.productAccess.revoke.useMutation({
    onSuccess: async () => {
      await invalidateProductAccess(utils, projectId);
      toast.success("Product access revoked.");
      setRevokeDialogOpen(false);
      setRevokeReason("");
    },
    onError: (error) => toast.error(error.message),
  });

  const data = accessQuery.data;
  const effectiveState = data?.accessState?.effectiveAccessState ?? null;
  const canSendWebhook = Boolean(data?.webhook?.isReady);

  const summaryCards = useMemo(() => {
    if (!data?.accessState) {
      return [];
    }

    return [
      {
        label: "Current access",
        value: humanizeValue(effectiveState ?? data.accessState.accessState),
        meta:
          data.accessState.grantedAt
            ? `Granted ${formatDateTime(data.accessState.grantedAt)}`
            : "No successful access grant yet",
        icon:
          effectiveState === "active" ? (
            <ShieldCheckIcon className="size-4 text-emerald-600" />
          ) : (
            <ShieldAlertIcon className="size-4 text-amber-600" />
          ),
      },
      {
        label: "Sync status",
        value: humanizeValue(data.accessState.syncStatus),
        meta:
          data.accessState.lastWebhookDeliveredAt
            ? `Last delivery ${formatDateTime(data.accessState.lastWebhookDeliveredAt)}`
            : data.accessState.lastWebhookError
              ? "Last webhook attempt failed"
              : "No delivery recorded yet",
        icon:
          data.accessState.syncStatus === "synced" ? (
            <CheckCircle2Icon className="size-4 text-emerald-600" />
          ) : (
            <AlertTriangleIcon className="size-4 text-amber-600" />
          ),
      },
      {
        label: "Access expiry",
        value: formatDateTime(data.accessState.accessExpiresAt) ?? "Not set",
        meta:
          effectiveState === "expired"
            ? "Central state has passed its expiry window"
            : "Required for grants and extensions",
        icon: <Clock3Icon className="size-4 text-zinc-600" />,
      },
      {
        label: "Product sync",
        value: formatDateTime(data.account?.lastSyncedAt) ?? "Never",
        meta:
          data.account?.externalWorkspaceId
            ? `Workspace ${data.account.externalWorkspaceId}`
            : "No external workspace recorded yet",
        icon: <PlugZapIcon className="size-4 text-zinc-600" />,
      },
    ];
  }, [data, effectiveState]);

  if (accessQuery.isLoading) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (accessQuery.isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load product access context.
      </div>
    );
  }

  if (!data.project.productId) {
    return (
      <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl font-semibold text-zinc-950">No linked product</h2>
            <p className="text-sm leading-7 text-zinc-600">
              This project does not have a downstream product attached yet, so there is no
              product access lifecycle to manage from this workspace.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setCreateMode(false);
                setLinkDialogOpen(true);
              }}
            >
              Link product
            </Button>
            <Button
              onClick={() => {
                setCreateMode(true);
                setLinkDialogOpen(true);
              }}
              variant="outline"
            >
              <PlusIcon className="size-4" />
              Create product
            </Button>
          </div>
        </div>
        <LinkProductDialog
          createMode={createMode}
          createProductMutationPending={createProductMutation.isPending}
          linkDialogOpen={linkDialogOpen}
          linkProductMutationPending={linkProductMutation.isPending}
          onCreateModeChange={setCreateMode}
          onOpenChange={(open) => {
            setLinkDialogOpen(open);
            if (!open) closeLinkDialog();
          }}
          onSubmitCreate={() => {
            const slug = slugify(productSlug || productName);
            if (!productName.trim()) {
              toast.error("Enter a product name.");
              return;
            }
            if (!slug) {
              toast.error("Enter a valid product slug.");
              return;
            }
            createProductMutation.mutate({
              name: productName.trim(),
              slug,
              kind: productKind,
              billingMode: productBillingMode,
            });
          }}
          onSubmitLink={() => {
            if (!selectedProductId) {
              toast.error("Select a product to link.");
              return;
            }
            linkProductMutation.mutate({
              projectId,
              productId: selectedProductId,
            });
          }}
          productBillingMode={productBillingMode}
          productKind={productKind}
          productName={productName}
          productOptions={productsQuery.data ?? []}
          productSlug={productSlug}
          selectedProductId={selectedProductId}
          setProductBillingMode={setProductBillingMode}
          setProductKind={setProductKind}
          setProductName={(value) => {
            setProductName(value);
            if (productSlug === "" || productSlug === slugify(productName)) {
              setProductSlug(slugify(value));
            }
          }}
          setProductSlug={setProductSlug}
          setSelectedProductId={setSelectedProductId}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                Product Access
              </p>
              <h2 className="mt-2 font-serif text-3xl text-zinc-950">
                {data.project.productName}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                Manually grant, extend, and revoke access for this project’s linked
                product. Actions update central state first, then send the configured
                outbound webhook to the downstream product.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{data.project.clientName}</Badge>
              <Badge>{humanizeValue(effectiveState ?? "pending")}</Badge>
            </div>
          </div>
        </div>

        {!canSendWebhook ? (
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-semibold text-amber-900">
                  Product webhook setup is blocking access actions
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-800">
                  Configure an active webhook URL and shared secret for this product before
                  the admin can grant, extend, or revoke access from the project workspace.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/admin/settings/webhooks/${data.project.productId}`}>
                  Open webhook settings
                </Link>
              </Button>
            </div>
          </div>
        ) : null}

        {data.accessState?.lastWebhookError ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
            <div className="text-sm font-semibold text-red-900">Last webhook attempt failed</div>
            <p className="mt-2 text-sm leading-6 text-red-800">
              {data.accessState.lastWebhookError}
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm" key={card.label}>
              <div className="flex items-center gap-2 text-sm text-zinc-500">{card.icon}</div>
              <div className="mt-4 text-sm text-zinc-500">{card.label}</div>
              <div className="mt-1 text-xl font-semibold text-zinc-950">{card.value}</div>
              <div className="mt-2 text-sm text-zinc-600">{card.meta}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="text-sm font-semibold text-zinc-900">Access controls</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  `Grant` activates access with a required expiry. `Extend` pushes that
                  expiry forward. `Revoke` keeps the central state updated even when the
                  downstream webhook fails.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={!canSendWebhook || grantMutation.isPending}
                  onClick={() => {
                    setGrantExpiry(nextDefaultExpiry());
                    setGrantDialogOpen(true);
                  }}
                >
                  Grant access
                </Button>
                <Button
                  disabled={!canSendWebhook || extendMutation.isPending}
                  onClick={() => {
                    setExtendExpiry(
                      data.accessState?.accessExpiresAt
                        ? formatDateTimeInput(new Date(data.accessState.accessExpiresAt))
                        : nextDefaultExpiry(),
                    );
                    setExtendDialogOpen(true);
                  }}
                  variant="outline"
                >
                  Extend access
                </Button>
                <Button
                  disabled={!canSendWebhook || revokeMutation.isPending}
                  onClick={() => setRevokeDialogOpen(true)}
                  variant="outline"
                >
                  Revoke access
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <InfoRow label="Product slug" value={data.project.productSlug ?? "Not set"} />
              <InfoRow
                label="External account"
                value={data.account?.externalAccountId ?? "Not configured"}
              />
              <InfoRow
                label="External workspace"
                value={data.account?.externalWorkspaceId ?? "Not configured"}
              />
              <InfoRow
                label="Account health"
                value={humanizeValue(data.account?.status ?? "pending")}
              />
            </div>

            {data.account?.accountUrl ? (
              <div className="mt-4">
                <Button asChild size="sm" variant="ghost">
                  <a href={data.account.accountUrl} rel="noreferrer" target="_blank">
                    Open external account
                    <ExternalLinkIcon className="size-4" />
                  </a>
                </Button>
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Webhook readiness</div>
            <div className="mt-4 space-y-3">
              <MetricRow
                label="Configuration"
                value={data.webhook?.isConfigured ? "Created" : "Missing"}
              />
              <MetricRow
                label="Activation"
                value={data.webhook?.isActive ? "Active" : "Inactive"}
              />
              <MetricRow
                label="Delivery target"
                value={data.webhook?.webhookUrl ?? "Not configured"}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Recent access history</div>
            <div className="mt-4 space-y-3">
              {data.history.length === 0 ? (
                <div className="text-sm text-zinc-500">No product access history yet.</div>
              ) : (
                data.history.map((entry) => (
                  <div
                    className="rounded-2xl border border-black/5 bg-[#faf8f4] p-4"
                    key={entry.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-zinc-950">
                        {humanizeValue(entry.eventType)}
                      </div>
                      <Badge variant="outline">{humanizeValue(entry.syncStatus)}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-zinc-600">
                      {humanizeValue(entry.accessState)} via {humanizeValue(entry.source)}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      {formatDateTime(entry.occurredAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Recent webhook deliveries</div>
            <div className="mt-4 space-y-3">
              {data.deliveries.length === 0 ? (
                <div className="text-sm text-zinc-500">No product webhook deliveries yet.</div>
              ) : (
                data.deliveries.map((delivery) => (
                  <div
                    className="rounded-2xl border border-black/5 bg-[#faf8f4] p-4"
                    key={delivery.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-zinc-950">{delivery.eventType}</div>
                      <Badge
                        variant={
                          delivery.deliveryStatus === "success" ? "default" : "outline"
                        }
                      >
                        {humanizeValue(delivery.deliveryStatus)}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-zinc-600">
                      {delivery.responseSummary ?? "No response summary captured"}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      {formatDateTime(delivery.occurredAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog onOpenChange={setGrantDialogOpen} open={grantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant product access</DialogTitle>
            <DialogDescription>
              This updates central access state first, then sends `access.granted` to the
              configured product webhook.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="grant-expiry">Access expires at</Label>
            <Input
              id="grant-expiry"
              onChange={(event) => setGrantExpiry(event.target.value)}
              type="datetime-local"
              value={grantExpiry}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setGrantDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={grantMutation.isPending}
              onClick={() => {
                const isoValue = toIsoDateTime(grantExpiry);
                if (!isoValue) {
                  toast.error("Choose a valid expiry date and time.");
                  return;
                }
                grantMutation.mutate({
                  projectId,
                  accessExpiresAt: isoValue,
                });
              }}
            >
              {grantMutation.isPending ? "Granting..." : "Grant access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setExtendDialogOpen} open={extendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend product access</DialogTitle>
            <DialogDescription>
              This keeps the access active and sends the updated expiry in another
              `access.granted` webhook.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="extend-expiry">New access expiry</Label>
            <Input
              id="extend-expiry"
              onChange={(event) => setExtendExpiry(event.target.value)}
              type="datetime-local"
              value={extendExpiry}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setExtendDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={extendMutation.isPending}
              onClick={() => {
                const isoValue = toIsoDateTime(extendExpiry);
                if (!isoValue) {
                  toast.error("Choose a valid expiry date and time.");
                  return;
                }
                extendMutation.mutate({
                  projectId,
                  accessExpiresAt: isoValue,
                });
              }}
            >
              {extendMutation.isPending ? "Extending..." : "Extend access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setRevokeDialogOpen} open={revokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke product access</DialogTitle>
            <DialogDescription>
              This moves central state to revoked immediately and then sends
              `access.revoked` to the downstream product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="revoke-reason">Reason</Label>
            <Textarea
              id="revoke-reason"
              onChange={(event) => setRevokeReason(event.target.value)}
              placeholder="Optional reason for the revoke action"
              rows={4}
              value={revokeReason}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setRevokeDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={revokeMutation.isPending}
              onClick={() =>
                revokeMutation.mutate({
                  projectId,
                  reason: revokeReason.trim() || null,
                })
              }
              variant="outline"
            >
              {revokeMutation.isPending ? "Revoking..." : "Revoke access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LinkProductDialog
        createMode={createMode}
        createProductMutationPending={createProductMutation.isPending}
        linkDialogOpen={linkDialogOpen}
        linkProductMutationPending={linkProductMutation.isPending}
        onCreateModeChange={setCreateMode}
        onOpenChange={(open) => {
          setLinkDialogOpen(open);
          if (!open) closeLinkDialog();
        }}
        onSubmitCreate={() => {
          const slug = slugify(productSlug || productName);
          if (!productName.trim()) {
            toast.error("Enter a product name.");
            return;
          }
          if (!slug) {
            toast.error("Enter a valid product slug.");
            return;
          }
          createProductMutation.mutate({
            name: productName.trim(),
            slug,
            kind: productKind,
            billingMode: productBillingMode,
          });
        }}
        onSubmitLink={() => {
          if (!selectedProductId) {
            toast.error("Select a product to link.");
            return;
          }
          linkProductMutation.mutate({
            projectId,
            productId: selectedProductId,
          });
        }}
        productBillingMode={productBillingMode}
        productKind={productKind}
        productName={productName}
        productOptions={productsQuery.data ?? []}
        productSlug={productSlug}
        selectedProductId={selectedProductId}
        setProductBillingMode={setProductBillingMode}
        setProductKind={setProductKind}
        setProductName={(value) => {
          setProductName(value);
          if (productSlug === "" || productSlug === slugify(productName)) {
            setProductSlug(slugify(value));
          }
        }}
        setProductSlug={setProductSlug}
        setSelectedProductId={setSelectedProductId}
      />
    </>
  );

  function closeLinkDialog() {
    setLinkDialogOpen(false);
    setSelectedProductId("");
    setCreateMode(false);
    setProductName("");
    setProductSlug("");
    setProductKind("custom");
    setProductBillingMode("manual");
  }
}

async function invalidateProductAccess(
  utils: ReturnType<typeof api.useUtils>,
  projectId: string,
) {
  await Promise.all([
    utils.admin.productAccess.byProject.invalidate({ projectId }),
    utils.admin.productAccounts.byProject.invalidate({ projectId }),
  ]);
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-[#faf8f4] px-4 py-3">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 break-words text-sm font-medium text-zinc-950">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-[#faf8f4] px-4 py-3">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-zinc-950">{value}</div>
    </div>
  );
}

function humanizeValue(value: string | null | undefined) {
  if (!value) return "Unknown";
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
}

function formatDateTimeInput(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIsoDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function LinkProductDialog({
  linkDialogOpen,
  onOpenChange,
  createMode,
  onCreateModeChange,
  productOptions,
  selectedProductId,
  setSelectedProductId,
  productName,
  setProductName,
  productSlug,
  setProductSlug,
  productKind,
  setProductKind,
  productBillingMode,
  setProductBillingMode,
  onSubmitLink,
  onSubmitCreate,
  linkProductMutationPending,
  createProductMutationPending,
}: {
  linkDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  createMode: boolean;
  onCreateModeChange: (value: boolean) => void;
  productOptions: Array<{ id: string; name: string; kind?: string | null }>;
  selectedProductId: string;
  setSelectedProductId: (value: string) => void;
  productName: string;
  setProductName: (value: string) => void;
  productSlug: string;
  setProductSlug: (value: string) => void;
  productKind: "saas" | "custom" | "service";
  setProductKind: (value: "saas" | "custom" | "service") => void;
  productBillingMode: "subscription" | "one_time" | "milestone" | "manual";
  setProductBillingMode: (
    value: "subscription" | "one_time" | "milestone" | "manual",
  ) => void;
  onSubmitLink: () => void;
  onSubmitCreate: () => void;
  linkProductMutationPending: boolean;
  createProductMutationPending: boolean;
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={linkDialogOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{createMode ? "Create and link product" : "Link product"}</DialogTitle>
          <DialogDescription>
            {createMode
              ? "Create the product record here, then attach it to this project immediately."
              : "Attach an existing downstream product to this project so product access can be managed here."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Button
            onClick={() => onCreateModeChange(false)}
            type="button"
            variant={createMode ? "outline" : "default"}
          >
            Existing product
          </Button>
          <Button
            onClick={() => onCreateModeChange(true)}
            type="button"
            variant={createMode ? "default" : "outline"}
          >
            Create product
          </Button>
        </div>

        {createMode ? (
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                onChange={(event) => setProductName(event.target.value)}
                value={productName}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                onChange={(event) => setProductSlug(slugify(event.target.value))}
                value={productSlug}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Kind</Label>
                <Select onValueChange={(value) => setProductKind(value as "saas" | "custom" | "service")} value={productKind}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Billing mode</Label>
                <Select
                  onValueChange={(value) =>
                    setProductBillingMode(
                      value as "subscription" | "one_time" | "milestone" | "manual",
                    )
                  }
                  value={productBillingMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="one_time">One time</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Product</Label>
            <Select onValueChange={setSelectedProductId} value={selectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {productOptions.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={linkProductMutationPending || createProductMutationPending}
            onClick={createMode ? onSubmitCreate : onSubmitLink}
          >
            {createMode
              ? createProductMutationPending
                ? "Creating..."
                : "Create and link"
              : linkProductMutationPending
                ? "Linking..."
                : "Link product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
