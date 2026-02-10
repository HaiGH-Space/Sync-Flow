'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "@/i18n/navigation"
import { workspaceService } from "@/lib/services/workspace"
import { cn, getFirstLetters } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function WorkspaceRail() {
    const params = useParams()
    const router = useRouter()
    const { isPending, error, data } = useQuery({
        queryKey: ['workspace-list'],
        staleTime: Infinity,
        queryFn: workspaceService.getMyWorkspace
    })
    useEffect(() => {
        if (error) {
            toast.error('Không thể tải danh sách workspace')
        }
    }, [error])
    return (
        <div className="w-20 h-full bg-card flex flex-col items-center gap-4 p-4">
            {isPending ? <>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="w-10 h-10 rounded-xl " />
                ))}
            </> : (
                data?.data.map(ws => (
                    <WorkspaceItem
                        key={ws.id}
                        name={ws.name}
                        isActive={params.workspaceId === ws.id}
                        actionActive={() => router.push(`/dashboard/${ws.id}`)}
                    />
                ))
            )}
        </div>
    )
}
type WorkspaceItemProps = {
    name: string,
    isActive: boolean,
    actionActive: () => void
}
function WorkspaceItem({ name, isActive, actionActive }: WorkspaceItemProps) {
    return (
        <div className="relative group flex items-center justify-center">
            <div className={cn(
                "absolute -left-3 w-1 h-8 bg-primary rounded-r-full transition-all duration-300",
                isActive ? "opacity-100 h-8" : "opacity-0 h-4 group-hover:opacity-50"
            )} />

            <button
                onClick={actionActive}
                className={cn(
                    "cursor-pointer relative w-10 h-10 flex items-center justify-center rounded-xl font-medium text-sm transition-all duration-200 select-none overflow-hidden",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-md scale-100"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
                )}
            >
                {getFirstLetters(name)}
            </button>

            <div className="absolute left-14 z-50 hidden px-2 py-1 text-xs font-medium text-white bg-black/90 rounded opacity-0 group-hover:opacity-100 group-hover:block whitespace-nowrap transition-opacity animate-in fade-in slide-in-from-left-2">
                {name}
                <div className="absolute top-1/2 -left-2 -mt-1 border-4 border-transparent border-r-black/90" />
            </div>
        </div>
    )
}