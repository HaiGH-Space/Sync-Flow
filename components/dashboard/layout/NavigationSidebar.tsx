'use client'
import { Workspace } from "@/lib/services/workspace";
import { useDashboard } from "@/lib/store/use-dashboard";
import { AnimatePresence, motion, Variants } from "motion/react"
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { Search } from "@/components/shared/Search";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/lib/services/project";
import { memo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import CreateProjectModal from "../comp/CreateProjectModal";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

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
    const router = useRouter()
    const { projectId } : { projectId: string | undefined } = useParams();
    const { data: projects, error, isFetching } = useQuery({
        queryKey: ['projects', workspaceDetail?.id],
        queryFn: () => projectService.getProjectsByWorkspaceId({ workspaceId: workspaceDetail!.id }),
        enabled: !!workspaceDetail?.id && isOpenSidebarLeft,
        staleTime: 5 * 60 * 1000,
    })

    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
    }, [error])
    const searchHandle = useCallback(async (query: string) => {
        console.log("Searching for:", query);
        // Logic search ở đây
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
                                    {isFetching && <p>Loading projects...</p>}
                                    {error && <p className="text-red-500">Error loading projects</p>}
                                    {projects?.data.map((project) => (
                                        <div
                                            onClick={() => {
                                                router.push(`/dashboard/${workspaceDetail?.id}/${project.id}`)
                                            }}
                                            key={project.id}
                                            className={cn(
                                                "px-3 py-2 rounded-md cursor-pointer transition-colors",
                                                projectId === project.id
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                            )}
                                        >
                                            {project.name}
                                        </div>
                                    ))}
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