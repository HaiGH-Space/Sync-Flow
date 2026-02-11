'use client'
import { NavigationSidebar } from "@/components/dashboard/layout/NavigationSidebar";
import { WorkspaceRail } from "@/components/dashboard/layout/WorkspaceRail";
import { useCurrentWorkspace } from "@/lib/hooks/use-current-workspace";
import { useEffect } from "react";
import { toast } from "sonner";

export default function DashBoardLayout({ children }: { children: React.ReactNode }) {
    const { workspaceList, isPending, error, workspaceId, activeWorkspace } = useCurrentWorkspace()

    useEffect(() => {
        if (error) {
            toast.error('Không thể tải danh sách workspace')
        }
    }, [error])

    return <div className="flex flex-row w-full h-screen">
        <WorkspaceRail workspaceList={workspaceList} isPending={isPending} workspaceActiveId={workspaceId} />
        <NavigationSidebar workspaceDetail={activeWorkspace} />
        {children}
    </div>
}