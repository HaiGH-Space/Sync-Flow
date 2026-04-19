"use client";

import type { Channel } from "@/lib/api/channel";
import type { Project } from "@/lib/api/project";
import type { Sprint } from "@/lib/api/sprint";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { NavigationSidebarProjectItem } from "./NavigationSidebarProjectItem";

type NavigationSidebarProjectListProps = {
  canLoadProjects: boolean;
  isProjectsLoading: boolean;
  projects: Project[];
  filteredProjects: Project[];
  workspaceId: string;
  expandedProjectId: string | null;
  onExpandProjectAction: (projectId: string) => void;
  onOpenProjectSettingsAction: (project: Project) => void;
  sprints?: Sprint[];
  isSprintsFetching: boolean;
  sprintsError?: Error | null;
  selectedSprintId: string;
  onSelectSprintAction: (sprintId: string) => void;
  onEditSprintAction: (sprint: Sprint) => void;
  channels?: Channel[];
  isChannelsFetching: boolean;
  channelsError?: Error | null;
  selectedChannelId: string;
  onSelectChannelAction: (channelId: string) => void;
};

export function NavigationSidebarProjectList({
  canLoadProjects,
  isProjectsLoading,
  projects,
  filteredProjects,
  workspaceId,
  expandedProjectId,
  onExpandProjectAction,
  onOpenProjectSettingsAction,
  sprints,
  isSprintsFetching,
  sprintsError,
  selectedSprintId,
  onSelectSprintAction,
  onEditSprintAction,
  channels,
  isChannelsFetching,
  channelsError,
  selectedChannelId,
  onSelectChannelAction,
}: NavigationSidebarProjectListProps) {
  const t = useTranslations("dashboard");

  return (
    <nav className="space-y-1">
      {isProjectsLoading && (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>{t("sidebar.loadingProjects")}</span>
        </div>
      )}

      {canLoadProjects && !isProjectsLoading && projects.length === 0 && (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          {t("sidebar.noProjects")}
        </div>
      )}

      {canLoadProjects &&
        !isProjectsLoading &&
        projects.length > 0 &&
        filteredProjects.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            {t("sidebar.noSearchResults")}
          </div>
        )}

      {filteredProjects.map((project) => (
        <NavigationSidebarProjectItem
          key={project.id}
          project={project}
          workspaceId={workspaceId}
          isExpanded={expandedProjectId === project.id}
          onExpandProjectAction={onExpandProjectAction}
          onOpenProjectSettingsAction={onOpenProjectSettingsAction}
          sprints={sprints}
          isSprintsFetching={isSprintsFetching}
          sprintsError={sprintsError}
          selectedSprintId={selectedSprintId}
          onSelectSprintAction={onSelectSprintAction}
          onEditSprintAction={onEditSprintAction}
          channels={channels}
          isChannelsFetching={isChannelsFetching}
          channelsError={channelsError}
          selectedChannelId={selectedChannelId}
          onSelectChannelAction={onSelectChannelAction}
        />
      ))}
    </nav>
  );
}
