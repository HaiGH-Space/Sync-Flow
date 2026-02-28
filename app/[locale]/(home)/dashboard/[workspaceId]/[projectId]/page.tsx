'use client'
import BoardCanvas from "@/components/canvas/BoardCanvas"
import { NavigateType, useDashboard } from "@/lib/store/use-dashboard"
import { useParams } from "next/navigation"

export default function DashBoardPage() {
    const { projectId } : { workspaceId: string, projectId: string } = useParams()
    const navigateActive = useDashboard((state) => (state.activeNavigate))

    return navigateActive.value === NavigateType.BOARD ? <BoardCanvas /> : <div>Other View</div>
}