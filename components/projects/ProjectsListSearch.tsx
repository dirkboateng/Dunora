"use client";

import { useState, useMemo, type ChangeEvent } from "react";
import Link from "next/link";
import { ProjectCard, type ProjectListItem } from "./ProjectCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { FolderIcon, PlusIcon } from "@/components/dashboard/Icon";
import { Button } from "@/components/ui/Button";

interface Props {
  projects: ProjectListItem[];
}

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "football_match", label: "Football match" },
  { value: "event", label: "Event" },
  { value: "portrait", label: "Portrait" },
  { value: "wedding", label: "Wedding" },
  { value: "club_night", label: "Club night" },
  { value: "other", label: "Other" },
];

export function ProjectsListSearch({ projects }: Props) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (typeFilter !== "all" && p.project_type !== typeFilter) return false;
      if (!q) return true;
      const haystack = [p.name, p.client_name ?? ""].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, typeFilter]);

  // Empty state — no projects at all
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderIcon size={24} />}
        title="No projects yet"
        description="Create your first project to start organizing shoots, uploads and galleries."
        action={
          <Link href="/dashboard/projects/new">
            <Button size="md">
              <PlusIcon size={16} className="mr-1.5" />
              Create project
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search projects by name or client…"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            className="w-full pl-10 pr-3 py-2.5 bg-surface border border-line rounded-xl text-sm text-ink placeholder:text-muted-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 bg-surface border border-line rounded-xl text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all min-w-[160px]"
        >
          {TYPE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-dashed border-line-strong rounded-2xl px-5 py-10 text-center">
          <p className="text-sm font-medium text-ink mb-1">
            No projects match your filter
          </p>
          <p className="text-xs text-muted">
            Try a different search term or clear the filter.
          </p>
        </div>
      ) : (
        <>
          <div className="text-xs text-muted mb-3">
            Showing {filtered.length} of {projects.length} projects
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
