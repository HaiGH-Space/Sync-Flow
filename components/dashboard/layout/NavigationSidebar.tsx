'use client'
import { Separator } from "@/components/ui/separator";
import { Workspace } from "@/lib/services/workspace";
import { useDashboard } from "@/lib/store/use-dashboard";
import { AnimatePresence, motion, Variants } from "motion/react"

const sidebarVariants: Variants = {
    expanded: {
        width: '250px',
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    collapsed: {
        width: '250px',
        opacity: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
}

const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
};

export function NavigationSidebar({ workspaceDetail}: { workspaceDetail?: Workspace }) {
    const isOpenSidebarLeft = useDashboard((state) => state.isOpenSidebarLeft)
    return (
        <AnimatePresence initial={false}>
            {isOpenSidebarLeft && (
                <motion.aside
                    className="bg-card text-card-foreground h-full overflow-hidden"
                    variants={sidebarVariants}
                    initial="collapsed"
                    animate={"expanded"}
                    exit="collapsed"
                >
                    <motion.div
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border overflow-hidden">
                            <h2 className="text-lg font-semibold">{workspaceDetail ? workspaceDetail.name : "No Workspace Selected"}</h2>
                        </div>
                        <Separator />
                        {/* Search */}

                        {/* Scrollable Content */}

                        {/* User Profile */}
                    </motion.div>
                </motion.aside>
            )}
        </AnimatePresence>
    )
}