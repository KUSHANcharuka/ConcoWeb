"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const clientCreateSchema = z.object({
  name: z.string().trim().min(2, "Company name is too short."),
  primaryContactEmail: z.string().trim().email(),
  primaryContactPhone: z.string().trim().max(32).nullable(),
  country: z.string().trim().max(120).nullable(),
  baseCurrency: z.string().trim().min(3, "Enter a currency code."),
  internalNotes: z.string().trim().max(2000).nullable(),
  firstInviteName: z.string().trim().max(120).nullable(),
  firstInviteEmail: z.string().trim().email().nullable(),
  firstInviteJobTitle: z.string().trim().max(120).nullable(),
  firstInvitePhone: z.string().trim().max(32).nullable(),
  firstInviteRole: z.enum(["admin", "member"]).default("admin"),
});

export type ClientCreateValues = z.infer<typeof clientCreateSchema>;

export function ClientCreateForm({
  isSubmitting,
  onCancel,
  onSubmit,
}: {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: ClientCreateValues) => Promise<void>;
}) {
  const form = useForm<ClientCreateValues>({
    resolver: zodResolver(clientCreateSchema),
    defaultValues: {
      name: "",
      primaryContactEmail: "",
      primaryContactPhone: null,
      country: null,
      baseCurrency: "USD",
      internalNotes: null,
      firstInviteName: null,
      firstInviteEmail: null,
      firstInviteJobTitle: null,
      firstInvitePhone: null,
      firstInviteRole: "admin",
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-2xl font-semibold text-zinc-900">
            Create client
          </DialogTitle>
          <DialogDescription className="text-zinc-600">
            Create the company record, provision the Clerk organization, and optionally send the first member invitation in the same flow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company name</FormLabel>
                <FormControl>
                  <Input placeholder="JCC" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base currency</FormLabel>
                <FormControl>
                  <Input placeholder="USD" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryContactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary contact email</FormLabel>
                <FormControl>
                  <Input placeholder="director@jcc.com" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryContactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary contact phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+94 77 123 4567"
                    {...field}
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Sri Lanka"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="internalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internal notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional notes for the admin team."
                  rows={4}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 border border-zinc-200 p-4">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Optional first member invite</div>
            <div className="mt-1 text-sm text-zinc-600">
              Leave this empty if you only want to create the client company for now.
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="firstInviteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Perera"
                      {...field}
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
              name="firstInviteJobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Managing Director"
                      {...field}
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
              name="firstInviteEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="director@jcc.com"
                      {...field}
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
              name="firstInviteRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstInvitePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+94 77 123 4567"
                      {...field}
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

        <DialogFooter>
          <Button disabled={isSubmitting} onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating..." : "Create client"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
