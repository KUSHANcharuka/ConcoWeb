"use client";

import { startTransition, useDeferredValue } from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  clientStatusOptions,
  type ClientStatusValue,
} from "~/components/clients/client-options";

export function ClientFilters({
  filters,
  onFiltersChange,
}: {
  filters: {
    search: string;
    status: ClientStatusValue | "all";
  };
  onFiltersChange: (next: {
    search: string;
    status: ClientStatusValue | "all";
  }) => void;
}) {
  const deferredSearch = useDeferredValue(filters.search);
  const hasFilters = deferredSearch.length > 0 || filters.status !== "all";

  return (
    <div className="space-y-4 border border-zinc-200 bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_220px]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            className="pl-9"
            onChange={(event) => {
              const value = event.target.value;
              startTransition(() => {
                onFiltersChange({ ...filters, search: value });
              });
            }}
            placeholder="Search company or primary contact"
            value={filters.search}
          />
        </div>

        <Select
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value as ClientStatusValue | "all",
            })
          }
          value={filters.status}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            {clientStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.status !== "all" && (
            <Badge className="gap-2" variant="outline">
              {clientStatusOptions.find((option) => option.value === filters.status)?.label}
              <button
                className="text-zinc-500 hover:text-zinc-900"
                onClick={() => onFiltersChange({ ...filters, status: "all" })}
                type="button"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}
          <Button
            className="h-7 px-2 text-xs"
            onClick={() => onFiltersChange({ search: "", status: "all" })}
            size="sm"
            type="button"
            variant="ghost"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
