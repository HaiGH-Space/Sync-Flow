'use client'
import { Workspace } from "@/lib/services/workspace";
import { useDashboard } from "@/lib/store/use-dashboard";
import { AnimatePresence, motion, Variants } from "motion/react"
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { Search } from "@/components/shared/Search";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/lib/services/project";
import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import CreateProjectModal from "../comp/CreateProjectModal";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { sprintService } from "@/lib/services/sprint";
import { ChevronRight } from "lucide-react";

const sidebarContainerVariants: Variants = {
    hidden: {
        width: 0,
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40,
        }
    },
    visible: {
        width: 250,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40,
        }
    }
}

export const NavigationSidebar = memo(function NavigationSidebar({ workspaceDetail }: { workspaceDetail?: Workspace }) {
    const isOpenSidebarLeft = useDashboard((state) => state.isOpenSidebarLeft)
    const { projectId }: { projectId: string | undefined } = useParams();
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(() => projectId ?? null)
    const { data: projects, error, isFetching } = useQuery({
        queryKey: ['projects', workspaceDetail?.id],
        queryFn: () => projectService.getProjectsByWorkspaceId({ workspaceId: workspaceDetail!.id }),
        enabled: !!workspaceDetail?.id && isOpenSidebarLeft,
        staleTime: 5 * 60 * 1000,
    })
    const { data: sprints, error: sprintsError, isFetching: isSprintsFetching } = useQuery({
        queryKey: ['sprints', expandedProjectId],
        queryFn: () => sprintService.getSprint({ projectId: expandedProjectId as string }),
        enabled: !!expandedProjectId && isOpenSidebarLeft,
        staleTime: 5 * 60 * 1000,
    })

    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
        if (sprintsError) {
            toast.error(sprintsError.message)
        }
    }, [error, sprintsError])
    const searchHandle = useCallback(async (query: string) => {
        console.log("Searching for:", query);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isOpenSidebarLeft && (
                <motion.aside
                    className="border-r border-border whitespace-nowrap bg-card text-card-foreground h-full overflow-hidden"
                    variants={sidebarContainerVariants}
                    initial="hidden"
                    animate={"visible"}
                    exit="hidden"
                >
                    <div className="h-full flex flex-col w-62.5">
                        {/* Header */}
                        <div className="h-14 px-4 flex flex-row justify-between items-center gap-2 border-b border-border overflow-hidden min-w-0">
                            {workspaceDetail ? (
                                <>
                                    <h2 className="text-lg font-semibold truncate">
                                        {workspaceDetail.name}
                                    </h2>
                                    <CreateProjectModal workspaceDetail={workspaceDetail} />
                                </>
                            ) : (
                                <h2 className="text-lg font-semibold truncate">
                                    No Workspace Selected
                                </h2>
                            )}
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-4 flex-1 flex flex-col mt-4 overflow-y-auto">
                            <div className="mb-4">
                                <Search placeholder="Search..." onSearch={searchHandle} />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <nav className="space-y-1">
                                    {isFetching && (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            Loading projects...
                                        </div>
                                    )}

                                    {!isFetching && (projects?.data?.length ?? 0) === 0 && (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            No projects yet
                                        </div>
                                    )}
                                    {projects?.data.map((project) => {
                                        const isExpanded = expandedProjectId === project.id
                                        return (
                                            <div key={project.id} className="rounded-md my-2">
                                                <Link
                                                    href={`/dashboard/${workspaceDetail?.id}/${project.id}`}
                                                    aria-label={`Switch to ${project.name}`}
                                                    aria-current={isExpanded ? "page" : undefined}
                                                    onClick={(e) => {
                                                        // Toggle when clicking the currently active project (collapse/expand)
                                                        // but still navigate when selecting a different project.
                                                        if (isExpanded) {
                                                            e.preventDefault()
                                                            setExpandedProjectId((prev) => (prev === project.id ? null : project.id))
                                                            return
                                                        }

                                                        setExpandedProjectId(project.id)
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium overflow-hidden",
                                                        isExpanded
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    <span className="truncate text-left">{project.name}</span>
                                                    <ChevronRight
                                                        className={cn(
                                                            "size-4 shrink-0 transition-transform duration-200",
                                                            isExpanded ? "rotate-90" : "rotate-0"
                                                        )}
                                                    />
                                                </Link>
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
                                                            <div className="mt-2 pl-3">
                                                                <div className="border-l border-border pl-3 space-y-1">
                                                                    {isSprintsFetching && (
                                                                        <div className="text-xs text-muted-foreground">
                                                                            Loading sprints...
                                                                        </div>
                                                                    )}
                                                                    {sprintsError && (
                                                                        <div className="text-xs text-destructive">
                                                                            Error loading sprints
                                                                        </div>
                                                                    )}
                                                                    {!isSprintsFetching && !sprintsError && (sprints?.data?.length ?? 0) === 0 && (
                                                                        <div className="cursor-default text-sm text-muted-foreground">
                                                                            No sprints yet
                                                                        </div>
                                                                    )}
                                                                    {sprints?.data.map((sprint) => (
                                                                        <div
                                                                            key={sprint.id}
                                                                            className="px-2 py-1 rounded-md text-sm text-muted-foreground hover:bg-accent/60 cursor-pointer"
                                                                        >
                                                                            {sprint.name}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )
                                    })}
                                </nav>
                            </div>
                        </div>
                        {/* User profile */}

                        <div className="p-4 border-t border-border">
                            <AvatarWithBadge alt="user avatar" src="https://github.com/shadcn.png" avtFallback="CN" status="online" />
                        </div>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    )
})