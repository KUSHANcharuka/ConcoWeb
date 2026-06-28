"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from "@/components/kibo-ui/combobox";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProjectCoverUploadField } from "~/components/admin/projects/project-cover-upload-field";
import {
  projectStatusOptions,
  projectTypeOptions,
} from "~/components/projects/project-options";

const projectTypeValues = [
  "custom_build",
  "saas_setup",
  "website",
  "mobile_app",
  "internal_tool",
  "other",
] as const;

const projectStatusValues = [
  "pending",
  "active",
  "paused",
  "completed",
  "archived",
] as const;

const projectCreateSchema = z.object({
  clientId: z.string().uuid({ message: "Select a client." }),
  productId: z.string().uuid().nullable(),
  name: z.string().trim().min(2, "Project name is too short."),
  description: z.string().trim().min(8, "Add a short project description."),
  projectType: z.enum(projectTypeValues),
  status: z.enum(projectStatusValues),
  currency: z.string().trim().min(3, "Enter a currency code."),
  coverAssetId: z.string().uuid().nullable(),
  startDate: z.string().nullable(),
  targetLaunchDate: z.string().nullable(),
});

export type ProjectCreateValues = z.infer<typeof projectCreateSchema>;

export function ProjectCreateForm({
  clientOptions,
  productOptions,
  isSubmitting,
  onCancel,
  onSubmit,
}: {
  clientOptions: Array<{
    id: string;
    name: string;
    baseCurrency: string;
  }>;
  productOptions: Array<{
    id: string;
    name: string;
  }>;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: ProjectCreateValues) => Promise<void>;
}) {
  const form = useForm<ProjectCreateValues>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      clientId: "",
      productId: null,
      name: "",
      description: "",
      projectType: "custom_build",
      status: "pending",
      currency: "USD",
      coverAssetId: null,
      startDate: null,
      targetLaunchDate: null,
    },
  });

  const selectedClientId = form.watch("clientId");

  useEffect(() => {
    const selectedClient = clientOptions.find((client) => client.id === selectedClientId);
    if (!selectedClient) {
      return;
    }

    form.setValue("currency", selectedClient.baseCurrency, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [clientOptions, form, selectedClientId]);

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-2xl font-semibold text-zinc-900">
            Create project
          </DialogTitle>
          <DialogDescription className="text-zinc-600">
            Add a visible client project workspace with a real cover upload and shared component structure for the future client portal.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Combobox
                      data={clientOptions.map((client) => ({
                        label: client.name,
                        value: client.id,
                      }))}
                      onValueChange={field.onChange}
                      type="client"
                      value={field.value}
                    >
                      <ComboboxTrigger className="w-full justify-between">
                        <span className="truncate text-left">
                          {field.value
                            ? clientOptions.find((client) => client.id === field.value)?.name
                            : "Select client"}
                        </span>
                      </ComboboxTrigger>
                      <ComboboxContent>
                        <ComboboxInput />
                        <ComboboxList>
                          <ComboboxEmpty />
                          <ComboboxGroup>
                            {clientOptions.map((client) => (
                              <ComboboxItem key={client.id} value={client.id}>
                                {client.name}
                              </ComboboxItem>
                            ))}
                          </ComboboxGroup>
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short internal description of the project engagement."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input maxLength={8} placeholder="USD" {...field} />
                    </FormControl>
                    <FormDescription>Uses the selected client currency by default.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                      value={field.value ?? "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Optional product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No linked product</SelectItem>
                        {productOptions.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetLaunchDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target launch</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-3">
            <FormField
              control={form.control}
              name="coverAssetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project cover</FormLabel>
                  <FormControl>
                    <ProjectCoverUploadField
                      clientId={selectedClientId}
                      onUploaded={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Uses Cloudflare R2 and links the uploaded asset to the project on create.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter className="gap-3 border-t border-zinc-200 pt-5">
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={isSubmitting || clientOptions.length === 0} type="submit">
            {isSubmitting ? "Creating..." : "Create project"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
