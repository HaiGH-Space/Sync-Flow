'use client'
import { useParams } from "next/navigation"

export default function DashBoardPage() {
    const { projectId } : { workspaceId: string, projectId: string } = useParams()
    
}