"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarRange,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Loader2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { createIssuesQueryOptions } from "@/queries/issue";
import { createSprintsQueryOptions } from "@/queries/sprint";
import type { Issue } from "@/lib/api/issue";
import type { Sprint } from "@/lib/api/sprint";
import { createDateFormatter } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type TimelineCanvasProps = {
  projectId: string;
};

type SprintPhase = "upcoming" | "active" | "completed" | "unscheduled";

function toDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateProgress(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) return null;

  const start = startDate.getTime();
  const end = endDate.getTime();
  if (end <= start) return null;

  const now = Date.now();
  const percent = ((now - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, percent));
}

function getSprintPhase(
  startDate: Date | null,
  endDate: Date | null,
): SprintPhase {
  if (!startDate || !endDate) return "unscheduled";

  const now = Date.now();
  if (now < startDate.getTime()) return "upcoming";
  if (now > endDate.getTime()) return "completed";
  return "active";
}

function getPriorityClass(priority: Issue["priority"]) {
  if (priority === "HIGH") return "bg-destructive";
  if (priority === "MEDIUM") return "bg-amber-500";
  return "bg-emerald-500";
}

function getStatusVariant(status: Sprint["status"]) {
  if (status === "ACTIVE") return "default" as const;
  if (status === "COMPLETED") return "secondary" as const;
  return "outline" as const;
}

function getPhaseVariant(phase: SprintPhase) {
  if (phase === "active") return "default" as const;
  if (phase === "completed") return "secondary" as const;
  return "outline" as const;
}

export default function TimelineCanvas({ projectId }: TimelineCanvasProps) {
  const tDashboard = useTranslations("dashboard");
  const locale = useLocale();
  const formatDate = createDateFormatter(locale, {
    day: "2-digit",
    month: "short",
  });

  const {
    data: sprintsResponse,
    error: sprintsError,
    isLoading: isLoadingSprints,
    refetch: refetchSprints,
    isRefetching: isRefetchingSprints,
  } = useQuery(createSprintsQueryOptions({ projectId }));

  const {
    data: issuesResponse,
    error: issuesError,
    isLoading: isLoadingIssues,
    refetch: refetchIssues,
    isRefetching: isRefetchingIssues,
  } = useQuery(createIssuesQueryOptions({ projectId }));

  const sprints = sprintsResponse?.data ?? [];
  const issues = issuesResponse?.data ?? [];

  const sortedSprints = useMemo(() => {
    return [...sprints].sort((a, b) => {
      const aStart = toDate(a.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bStart = toDate(b.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      if (aStart !== bStart) return aStart - bStart;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [sprints]);

  const issuesBySprint = useMemo(() => {
    const grouped = new Map<string, Issue[]>();

    for (const issue of issues) {
      if (!issue.sprintId) continue;
      const current = grouped.get(issue.sprintId) ?? [];
      current.push(issue);
      grouped.set(issue.sprintId, current);
    }

    for (const issueGroup of grouped.values()) {
      issueGroup.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    return grouped;
  }, [issues]);

  const unscheduledIssuesCount = useMemo(() => {
    return issues.filter((issue) => !issue.sprintId).length;
  }, [issues]);

  const sprintCards = useMemo(() => {
    return sortedSprints.map((sprint) => {
      const sprintIssues = issuesBySprint.get(sprint.id) ?? [];
      const startDate = toDate(sprint.startDate);
      const endDate = toDate(sprint.endDate);
      const progress = calculateProgress(startDate, endDate);
      const phase = getSprintPhase(startDate, endDate);
      const dateLabel =
        startDate && endDate
          ? `${formatDate(startDate)} - ${formatDate(endDate)}`
          : tDashboard("timeline.card.noDate");

      return {
        sprint,
        sprintIssues,
        progress,
        phase,
        dateLabel,
      };
    });
  }, [formatDate, issuesBySprint, sortedSprints, tDashboard]);

  const timelineStats = useMemo(() => {
    const activeSprints = sprintCards.filter(
      ({ phase }) => phase === "active",
    ).length;
    const upcomingSprints = sprintCards.filter(
      ({ phase }) => phase === "upcoming",
    ).length;
    const completedSprints = sprintCards.filter(
      ({ phase }) => phase === "completed",
    ).length;

    return {
      totalSprints: sprintCards.length,
      activeSprints,
      upcomingSprints,
      completedSprints,
      scheduledIssues: issues.length - unscheduledIssuesCount,
      unscheduledIssues: unscheduledIssuesCount,
    };
  }, [issues.length, sprintCards, unscheduledIssuesCount]);

  const handleRetry = () => {
    void refetchSprints();
    void refetchIssues();
  };

  const isRetrying = isRefetchingSprints || isRefetchingIssues;

  const getPhaseLabel = (phase: SprintPhase) => {
    if (phase === "active") return tDashboard("timeline.phase.active");
    if (phase === "completed") return tDashboard("timeline.phase.completed");
    if (phase === "upcoming") return tDashboard("timeline.phase.upcoming");
    return tDashboard("timeline.phase.unscheduled");
  };

  const getStatusLabel = (status: Sprint["status"]) => {
    if (status === "ACTIVE") return tDashboard("timeline.status.active");
    if (status === "COMPLETED") return tDashboard("timeline.status.completed");
    return tDashboard("timeline.status.planned");
  };

  if (isLoadingSprints || isLoadingIssues) {
    return (
      <div className="flex h-full flex-col gap-4">
        <Skeleton className="h-32 rounded-2xl border border-border/70" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`timeline-summary-skeleton-${index}`}
              className="h-24 rounded-2xl border border-border/70"
            />
          ))}
        </div>
        <Skeleton className="min-h-105 flex-1 rounded-2xl border border-border/70" />
      </div>
    );
  }

  if (sprintsError || issuesError) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleAlert className="size-6" />
          </div>
          <p className="text-base font-semibold text-foreground">
            {tDashboard("timeline.error")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRetrying}
            className="mt-4 cursor-pointer min-w-30"
          >
            {isRetrying ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                {tDashboard("timeline.loading")}
              </span>
            ) : (
              tDashboard("timeline.retry")
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (sortedSprints.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-2xl border border-border/70 bg-card/80 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarRange className="size-6" />
          </div>
          <p className="text-base font-semibold text-foreground">
            {tDashboard("timeline.emptyTitle")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {tDashboard("timeline.emptyHint")}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">
              {tDashboard("timeline.summary.unscheduledIssues")}:{" "}
              {unscheduledIssuesCount}
            </Badge>
            <Badge variant="secondary">
              {tDashboard("timeline.summary.totalSprints")}: 0
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-0.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
              <Clock3 className="size-3.5" />
              {tDashboard("navigation.timeline")}
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-foreground">
                {tDashboard("timeline.title")}
              </h2>
              <p className="max-w-2xl text-sm leading-5 text-muted-foreground">
                {tDashboard("timeline.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-start justify-start gap-2 lg:justify-end">
            <Badge variant="default" className="gap-1.5 text-[11px]">
              <CheckCircle2 className="size-3.5" />
              {tDashboard("timeline.phase.active")}:{" "}
              {timelineStats.activeSprints}
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              {tDashboard("timeline.phase.upcoming")}:{" "}
              {timelineStats.upcomingSprints}
            </Badge>
            <Badge variant="secondary" className="text-[11px]">
              {tDashboard("timeline.phase.completed")}:{" "}
              {timelineStats.completedSprints}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-background/90 p-3 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tDashboard("timeline.summary.totalSprints")}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {timelineStats.totalSprints}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/90 p-3 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tDashboard("timeline.summary.scheduledIssues")}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {timelineStats.scheduledIssues}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/90 p-3 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tDashboard("timeline.summary.unscheduledIssues")}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {timelineStats.unscheduledIssues}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/90 p-3 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {tDashboard("timeline.summary.activeSprints")}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {timelineStats.activeSprints}
          </p>
        </div>
      </div>

      <ScrollArea className="w-full flex-1 min-h-0 rounded-2xl border border-border/70 bg-card/70 shadow-sm">
        <div className="w-max px-4 py-4 pr-6">
          <div className="flex items-stretch">
            {sprintCards.map(
              ({ sprint, sprintIssues, progress, phase, dateLabel }, index) => {
                const visibleIssues = sprintIssues.slice(0, 3);
                const hiddenCount = Math.max(
                  0,
                  sprintIssues.length - visibleIssues.length,
                );

                return (
                  <div key={sprint.id} className="flex shrink-0 items-stretch">
                    {index > 0 ? (
                      <div className="relative flex w-16 shrink-0 items-center justify-center">
                        <div className="h-px w-full bg-border/80" />
                        <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm" />
                      </div>
                    ) : null}

                    <article className="relative w-85 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-3 shadow-sm transition-transform">
                      <div
                        className={cn(
                          "absolute inset-x-0 top-0 h-1",
                          phase === "active" && "bg-primary",
                          phase === "upcoming" && "bg-amber-500",
                          phase === "completed" && "bg-emerald-500",
                          phase === "unscheduled" && "bg-muted-foreground/40",
                        )}
                      />

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {sprint.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {dateLabel}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <Badge variant={getStatusVariant(sprint.status)}>
                            {getStatusLabel(sprint.status)}
                          </Badge>
                          <Badge
                            variant={getPhaseVariant(phase)}
                            className="text-[11px] uppercase tracking-[0.16em]"
                          >
                            {getPhaseLabel(phase)}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-border/60 bg-muted/25 p-2.5">
                        <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>
                            {tDashboard("timeline.card.durationLabel")}
                          </span>
                          <span>
                            {progress !== null
                              ? `${Math.round(progress)}%`
                              : "-"}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full bg-primary transition-all",
                              progress === null && "w-0",
                            )}
                            style={{ width: `${progress ?? 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>
                            {tDashboard("timeline.card.issueCount", {
                              count: String(sprintIssues.length),
                            })}
                          </span>
                          {hiddenCount > 0 ? (
                            <span>
                              {tDashboard("timeline.card.overflow", {
                                count: String(hiddenCount),
                              })}
                            </span>
                          ) : null}
                        </div>

                        {sprintIssues.length === 0 ? (
                          <div className="mt-2.5 rounded-lg border border-dashed border-border/70 bg-muted/20 p-2.5 text-sm text-muted-foreground">
                            {tDashboard("timeline.card.noIssues")}
                          </div>
                        ) : (
                          <ul className="mt-2.5 space-y-1.5">
                            {visibleIssues.map((issue) => (
                              <li
                                key={issue.id}
                                className="flex items-start gap-2 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-sm"
                              >
                                <span
                                  className={cn(
                                    "mt-1 size-1.5 shrink-0 rounded-full",
                                    getPriorityClass(issue.priority),
                                  )}
                                  aria-hidden
                                />
                                <span className="min-w-0 flex-1 truncate text-foreground">
                                  #{issue.number} {issue.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                        <span>{tDashboard("timeline.card.statusLabel")}</span>
                        <span>
                          {phase === "active"
                            ? tDashboard("timeline.phase.active")
                            : getPhaseLabel(phase)}
                        </span>
                      </div>
                    </article>
                  </div>
                );
              },
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
