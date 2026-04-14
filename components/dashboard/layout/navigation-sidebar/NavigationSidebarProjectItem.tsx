"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/api/project";
import type { Sprint } from "@/lib/api/sprint";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { NavigationSidebarSprintList } from "./NavigationSidebarSprintList";

type NavigationSidebarProjectItemProps = {
  project: Project;
  workspaceId: string;
  isExpanded: boolean;
  onExpandProjectAction: (projectId: string) => void;
  onOpenProjectSettingsAction: (project: Project) => void;
  sprints?: Sprint[];
  isSprintsFetching: boolean;
  sprintsError?: Error | null;
  selectedSprintId: string;
  onSelectSprintAction: (sprintId: string) => void;
  onEditSprintAction: (sprint: Sprint) => void;
};

export function NavigationSidebarProjectItem({
  project,
  workspaceId,
  isExpanded,
  onExpandProjectAction,
  onOpenProjectSettingsAction,
  sprints,
  isSprintsFetching,
  sprintsError,
  selectedSprintId,
  onSelectSprintAction,
  onEditSprintAction,
}: NavigationSidebarProjectItemProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="rounded-md my-2">
      <div className="flex items-center gap-1">
        <Link
          href={`/dashboard/${workspaceId}/${project.id}`}
          aria-label={`Switch to ${project.name}`}
          aria-current={isExpanded ? "page" : undefined}
          onClick={(event) => {
            if (isExpanded) {
              event.preventDefault();
            }
            onExpandProjectAction(project.id);
          }}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium overflow-hidden",
            isExpanded
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <span className="truncate text-left">{project.name}</span>
          <ChevronRight
            className={cn(
              "size-4 shrink-0 transition-transform duration-200",
              isExpanded ? "rotate-90" : "rotate-0",
            )}
          />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label={t("project.settings.action", { name: project.name })}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onOpenProjectSettingsAction(project);
          }}
        >
          <Settings2 className="size-4" />
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`sprints-${project.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <NavigationSidebarSprintList
              sprints={sprints}
              isFetching={isSprintsFetching}
              error={sprintsError}
              selectedSprintId={selectedSprintId}
              onSelectSprintAction={onSelectSprintAction}
              onEditSprintAction={onEditSprintAction}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
