"use client";

import { startTransition, useDeferredValue } from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from "@/components/kibo-ui/combobox";
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
  projectStatusOptions,
  projectTypeOptions,
  type ProjectStatusValue,
  type ProjectTypeValue,
} from "~/components/projects/project-options";

type ClientOption = {
  id: string;
  name: string;
};

export function ProjectFilters({
  clientOptions,
  filters,
  onFiltersChange,
}: {
  clientOptions: ClientOption[];
  filters: {
    search: string;
    clientId: string;
    status: ProjectStatusValue | "all";
    projectType: ProjectTypeValue | "all";
  };
  onFiltersChange: (next: {
    search: string;
    clientId: string;
    status: ProjectStatusValue | "all";
    projectType: ProjectTypeValue | "all";
  }) => void;
}) {
  const deferredSearch = useDeferredValue(filters.search);
  const hasFilters =
    deferredSearch.length > 0 ||
    filters.clientId.length > 0 ||
    filters.status !== "all" ||
    filters.projectType !== "all";

  return (
    <div className="space-y-4 border border-zinc-200 bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_200px_200px]">
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
            placeholder="Search projects or clients"
            value={filters.search}
          />
        </div>

        <Combobox
          data={clientOptions.map((client) => ({
            label: client.name,
            value: client.id,
          }))}
          onValueChange={(value) => onFiltersChange({ ...filters, clientId: value })}
          type="client"
          value={filters.clientId}
        >
          <ComboboxTrigger className="w-full justify-between">
            <span className="truncate text-left">
              {filters.clientId
                ? clientOptions.find((client) => client.id === filters.clientId)?.name
                : "All clients"}
            </span>
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput />
            <ComboboxList>
              <ComboboxEmpty />
              <ComboboxGroup>
                <ComboboxItem onSelect={() => onFiltersChange({ ...filters, clientId: "" })} value="__all__">
                  All clients
                </ComboboxItem>
                {clientOptions.map((client) => (
                  <ComboboxItem key={client.id} value={client.id}>
                    {client.name}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Select
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value as ProjectStatusValue | "all",
            })
          }
          value={filters.status}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            {projectStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              projectType: value as ProjectTypeValue | "all",
            })
          }
          value={filters.projectType}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any type</SelectItem>
            {projectTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.clientId && (
            <Badge className="gap-2" variant="outline">
              {clientOptions.find((client) => client.id === filters.clientId)?.name}
              <button
                className="text-zinc-500 hover:text-zinc-900"
                onClick={() => onFiltersChange({ ...filters, clientId: "" })}
                type="button"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge className="gap-2" variant="outline">
              {projectStatusOptions.find((option) => option.value === filters.status)?.label}
              <button
                className="text-zinc-500 hover:text-zinc-900"
                onClick={() => onFiltersChange({ ...filters, status: "all" })}
                type="button"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}
          {filters.projectType !== "all" && (
            <Badge className="gap-2" variant="outline">
              {projectTypeOptions.find((option) => option.value === filters.projectType)?.label}
              <button
                className="text-zinc-500 hover:text-zinc-900"
                onClick={() => onFiltersChange({ ...filters, projectType: "all" })}
                type="button"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}
          <Button
            className="h-7 px-2 text-xs"
            onClick={() =>
              onFiltersChange({
                search: "",
                clientId: "",
                status: "all",
                projectType: "all",
              })
            }
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
