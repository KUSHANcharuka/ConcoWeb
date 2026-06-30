"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BoxesIcon,
  CircleAlertIcon,
  LoaderCircleIcon,
  PlusIcon,
  WebhookIcon,
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
import { api } from "~/trpc/react";

type CreateProductForm = {
  name: string;
  slug: string;
  kind: "saas" | "custom" | "service";
  billingMode: "subscription" | "one_time" | "milestone" | "manual";
};

const emptyForm: CreateProductForm = {
  name: "",
  slug: "",
  kind: "saas",
  billingMode: "manual",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function WebhooksPageClient() {
  const utils = api.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateProductForm>(emptyForm);
  const webhooksQuery = api.admin.settingsBilling.webhooks.useQuery();
  const createProductMutation = api.admin.products.create.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.admin.settingsBilling.webhooks.invalidate(),
        utils.admin.settingsBilling.page.invalidate(),
        utils.admin.products.options.invalidate(),
      ]);
      toast.success("Product created.");
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (error) => toast.error(error.message),
  });

  const summary = useMemo(() => {
    const items = webhooksQuery.data ?? [];
    return {
      totalProducts: items.length,
      configuredProducts: items.filter((item) => item.isConfigured).length,
      activeWebhooks: items.filter((item) => item.isConfigured && item.isActive).length,
      recentFailures: items.filter((item) => item.lastFailureAt).length,
    };
  }, [webhooksQuery.data]);

  if (webhooksQuery.isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (webhooksQuery.isError || !webhooksQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load webhook settings.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Products</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{summary.totalProducts}</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Configured</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{summary.configuredProducts}</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Active</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{summary.activeWebhooks}</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Recent failures</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{summary.recentFailures}</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button onClick={() => setDialogOpen(true)}>
              <PlusIcon className="size-4" />
              Create Product
            </Button>
          </div>
        </div>

        {webhooksQuery.data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 shadow-sm">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
                <BoxesIcon className="size-5 text-zinc-600" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-950">No products yet</h2>
              <p className="text-sm leading-7 text-zinc-600">
                Webhooks are configured per product. Create the first product here, then open its
                dashboard to add the webhook endpoint and review delivery logs.
              </p>
              <div className="pt-2">
                <Button onClick={() => setDialogOpen(true)}>
                  <PlusIcon className="size-4" />
                  Create Product
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {webhooksQuery.data.map((item) => (
              <div
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                key={item.productId}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <WebhookIcon className="size-4 text-zinc-500" />
                      <div className="text-lg font-semibold text-zinc-950">{item.productName}</div>
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">{item.productSlug}</div>
                  </div>
                  <Badge variant={item.isConfigured ? (item.isActive ? "default" : "outline") : "outline"}>
                    {item.isConfigured ? (item.isActive ? "Active" : "Inactive") : "Not configured"}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-zinc-600">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Kind</div>
                    <div className="mt-1">{item.productKind}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Billing mode</div>
                    <div className="mt-1">{item.billingMode.replaceAll("_", " ")}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Status</div>
                    <div className="mt-1">{item.productStatus}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Webhook</div>
                    <div className="mt-1">{item.isConfigured ? "Configured" : "Create webhook"}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Deliveries</div>
                    <div className="mt-1">{item.totalDeliveries}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Last failure</div>
                    <div className="mt-1">
                      {item.lastFailureAt
                        ? new Date(item.lastFailureAt).toLocaleString()
                        : "No failed delivery yet"}
                    </div>
                  </div>
                </div>

                {!item.isConfigured ? (
                  <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                    <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
                    <p>This product exists, but its webhook has not been created yet.</p>
                  </div>
                ) : null}

                <div className="mt-5">
                  <Button asChild variant="outline">
                    <Link href={`/admin/settings/webhooks/${item.productId}`}>
                      {item.isConfigured ? "Open webhook dashboard" : "Create webhook"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create product</DialogTitle>
            <DialogDescription>
              This creates the product record used by project billing and webhook setup.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                    slug:
                      current.slug === "" || current.slug === slugify(current.name)
                        ? slugify(event.target.value)
                        : current.slug,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: slugify(event.target.value),
                  }))
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Kind</Label>
                <Select
                  value={form.kind}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      kind: value as CreateProductForm["kind"],
                    }))
                  }
                >
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
                  value={form.billingMode}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      billingMode: value as CreateProductForm["billingMode"],
                    }))
                  }
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

          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={createProductMutation.isPending}
              onClick={() => createProductMutation.mutate(form)}
            >
              {createProductMutation.isPending ? "Creating..." : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
