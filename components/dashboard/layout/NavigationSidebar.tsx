'use client'
import { Workspace } from "@/lib/api/workspace";
import { useDashboard } from "@/lib/store/use-dashboard";
import { AnimatePresence, motion, Variants } from "motion/react"
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { Search } from "@/components/shared/Search";
import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CreateProjectModal from "../comp/CreateProjectModal";
import { Link, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/use-profile";
import DeleteConfirmModal from "../comp/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { createWorkspaceDetailQueryOptions } from "@/queries/workspace";
import { createProjectsQueryOptions } from "@/queries/project";
import { createSprintsQueryOptions } from "@/queries/sprint";
import { useDeleteProject } from "@/hooks/mutations/project";
import WorkspaceSettingsMenu from "../comp/WorkspaceSettingsMenu";

type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER';

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
    const t = useTranslations('dashboard');
    const router = useRouter();
    const { data: profile } = useProfile();
    const profileId = profile?.id
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(() => projectId ?? null)
    const [searchQuery, setSearchQuery] = useState('')
    const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)
    const canLoadProjects = !!workspaceDetail?.id && isOpenSidebarLeft

    const { data: workspaceDetailResponse } = useQuery(
        createWorkspaceDetailQueryOptions({ workspaceId: workspaceDetail?.id ?? '' }, {
            enabled: !!workspaceDetail?.id && isOpenSidebarLeft,
        })
    )

    const activeWorkspace = workspaceDetailResponse?.data ?? workspaceDetail

    const currentWorkspaceRole = useMemo<WorkspaceRole>(() => {
        if (!activeWorkspace || !profileId) {
            return 'MEMBER'
        }

        if (activeWorkspace.ownerId === profileId) {
            return 'OWNER'
        }

        const currentMembership = activeWorkspace.members?.find((member) => member.userId === profileId)
        return currentMembership?.role ?? 'MEMBER'
    }, [activeWorkspace, profileId])

    const canManageProject = currentWorkspaceRole === 'OWNER' || currentWorkspaceRole === 'ADMIN'

    const { data: projects, error, isFetching } = useQuery(
        createProjectsQueryOptions({ workspaceId: workspaceDetail?.id ?? '' }, {
            enabled: canLoadProjects,
        })
    )
    const isProjectsLoading = canLoadProjects && (isFetching || !projects)

    const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject(workspaceDetail?.id ?? '')

    const { data: sprints, error: sprintsError, isFetching: isSprintsFetching } = useQuery(
        createSprintsQueryOptions({ projectId: expandedProjectId ?? '' }, {
            enabled: !!expandedProjectId && isOpenSidebarLeft,
        })
    )

    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
        if (sprintsError) {
            toast.error(sprintsError.message)
        }
    }, [error, sprintsError])

    const filteredProjects = useMemo(() => {
        const projectList = projects?.data ?? []
        const normalizedQuery = searchQuery.trim().toLowerCase()

        if (!normalizedQuery) {
            return projectList
        }

        return projectList.filter((project) =>
            project.name.toLowerCase().includes(normalizedQuery)
        )
    }, [projects?.data, searchQuery])

    const searchHandle = useCallback(async (query: string) => {
        setSearchQuery(query)
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {isOpenSidebarLeft && (
                    <motion.aside
                        className="border-r border-border/70 whitespace-nowrap bg-background text-foreground h-full overflow-hidden"
                        variants={sidebarContainerVariants}
                        initial="hidden"
                        animate={"visible"}
                        exit="hidden"
                    >
                        <div className="h-full flex flex-col w-62.5">
                        {/* Header */}
                        <div className="h-14 px-4 flex flex-row justify-between items-center gap-2 border-b border-border/70 bg-background/90 backdrop-blur overflow-hidden min-w-0">
                            {workspaceDetail ? (
                                <>
                                    <WorkspaceSettingsMenu workspace={workspaceDetail} role={currentWorkspaceRole} />
                                    {canManageProject && <CreateProjectModal workspaceDetail={workspaceDetail} />}
                                </>
                            ) : (
                                <h2 className="text-lg font-semibold truncate">
                                    {t('sidebar.noWorkspaceSelected')}
                                </h2>
                            )}
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-4 flex-1 flex flex-col mt-4 overflow-y-auto">
                            <div className="mb-4">
                                <Search placeholder={t('sidebar.searchPlaceholder')} onSearch={searchHandle} />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <nav className="space-y-1">
                                    {isProjectsLoading && (
                                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                                            <Loader2 className="size-4 animate-spin" />
                                            <span>{t('sidebar.loadingProjects')}</span>
                                        </div>
                                    )}

                                    {canLoadProjects && !isProjectsLoading && (projects?.data?.length ?? 0) === 0 && (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            {t('sidebar.noProjects')}
                                        </div>
                                    )}
                                    {canLoadProjects && !isProjectsLoading && (projects?.data?.length ?? 0) > 0 && filteredProjects.length === 0 && (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            {t('sidebar.noSearchResults')}
                                        </div>
                                    )}
                                    {filteredProjects.map((project) => {
                                        const isExpanded = expandedProjectId === project.id
                                        const isDeletingCurrentProject = isDeletingProject && projectToDelete?.id === project.id

                                        return (
                                            <div key={project.id} className="rounded-md my-2">
                                                <div className="flex items-center gap-1">
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
                                                    {canManageProject && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="text-muted-foreground hover:text-destructive"
                                                            aria-label={t('project.delete.action', { name: project.name })}
                                                            disabled={isDeletingCurrentProject}
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                setProjectToDelete({ id: project.id, name: project.name })
                                                            }}
                                                        >
                                                            {isDeletingCurrentProject ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                                                        </Button>
                                                    )}
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
                                                            <div className="mt-2 pl-3">
                                                                <div className="border-l border-border pl-3 space-y-1">
                                                                    {isSprintsFetching && (
                                                                        <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
                                                                            <Loader2 className="size-3.5 animate-spin" />
                                                                            <span>{t('sidebar.loadingSprints')}</span>
                                                                        </div>
                                                                    )}
                                                                    {sprintsError && (
                                                                        <div className="text-xs text-destructive">
                                                                            {t('sidebar.errorLoadingSprints')}
                                                                        </div>
                                                                    )}
                                                                    {!isSprintsFetching && !sprintsError && (sprints?.data?.length ?? 0) === 0 && (
                                                                        <div className="cursor-default text-sm text-muted-foreground">
                                                                            {t('sidebar.noSprints')}
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

            <DeleteConfirmModal
                isOpen={!!projectToDelete}
                isLoading={isDeletingProject}
                title={t('project.delete.title', { name: projectToDelete?.name ?? '' })}
                description={t('project.delete.description')}
                onConfirm={() => {
                    if (!projectToDelete || !workspaceDetail?.id) {
                        return
                    }

                    deleteProject({
                        workspaceId: workspaceDetail.id,
                        projectId: projectToDelete.id,
                    }, {
                        onSuccess: (_response, variables) => {
                            toast.success(t('project.toast.deleted'))

                            if (projectId === variables.projectId) {
                                setExpandedProjectId(null)
                                router.push(`/dashboard/${workspaceDetail.id}`)
                            }

                            setProjectToDelete(null)
                        },
                        onError: () => {
                            toast.error(t('project.toast.deleteFailed'))
                        },
                    })
                }}
                onClose={(isOpen) => {
                    if (!isOpen && !isDeletingProject) {
                        setProjectToDelete(null)
                    }
                }}
            />
        </>
    )
})