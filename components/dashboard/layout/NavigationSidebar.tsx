'use client'
import { Workspace } from "@/lib/services/workspace";
import { useDashboard } from "@/lib/store/use-dashboard";
import { AnimatePresence, motion, Variants } from "motion/react"
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { Search } from "@/components/shared/Search";

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

export function NavigationSidebar({ workspaceDetail }: { workspaceDetail?: Workspace }) {
    const isOpenSidebarLeft = useDashboard((state) => state.isOpenSidebarLeft)
    const searchHandle = async (query: string) => {
        console.log("Searching for:", query);
    }
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
                        <div className="h-14 px-4 flex flex-row justify-between items-center gap-2 pb-4 border-b border-border overflow-hidden min-w-0">
                            <h2 className="text-lg font-semibold truncate">
                                {workspaceDetail ? workspaceDetail.name : "No Workspace Selected"}
                            </h2>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-4 flex-1 flex flex-col mt-4 overflow-y-auto">
                            <div className="mb-4">
                                <Search placeholder="Search..." onSearch={searchHandle} />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <nav className="space-y-1">
                                    {Array.from({ length: 30 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="px-2 py-1.5 text-sm hover:bg-accent rounded"
                                        >
                                            Menu Item {index + 1}
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
}