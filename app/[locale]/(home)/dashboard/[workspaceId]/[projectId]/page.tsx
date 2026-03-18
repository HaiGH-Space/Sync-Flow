'use client'
import BoardCanvas from "@/components/canvas/BoardCanvas"
import { NavigateType, useDashboard } from "@/lib/store/use-dashboard"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

export default function DashBoardPage() {
    const { projectId } : { workspaceId: string, projectId: string } = useParams()
    const navigateActive = useDashboard((state) => (state.activeNavigate))
    const t = useTranslations('dashboard')

    return navigateActive.value === NavigateType.BOARD ? <BoardCanvas projectId={projectId} /> : <div>{t('otherView')}</div>
}