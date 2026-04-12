import type { Issue } from "@/lib/api/issue";

export type SprintPhase = "upcoming" | "active" | "completed" | "unscheduled";

export type TimelineBadgeVariant = "default" | "secondary" | "outline";

export type TimelineSprintItemData = {
  id: string;
  title: string;
  dateLabel: string;
  progress: number | null;
  phase: SprintPhase;
  phaseLabel: string;
  phaseVariant: TimelineBadgeVariant;
  statusLabel: string;
  statusVariant: TimelineBadgeVariant;
  issues: Issue[];
  issueCount: number;
  issueCountLabel: string;
  progressLabel: string;
  noIssuesLabel: string;
  statusFooterLabel: string;
  overflowLabel: string;
  visibleIssues: Issue[];
  overflowCount: number;
};
