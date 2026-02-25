'use client'
import { sprintService } from "@/lib/services/sprint"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function DashBoardPage() {
    const { projectId } : { workspaceId: string, projectId: string } = useParams()
    const { data: sprint, isLoading, error } = useQuery({
        queryKey: ["sprint", projectId],
        queryFn: async () => {
            const res = await sprintService.getSprint({ projectId })
            return res.data
        },
        staleTime: 5 * 60 * 1000,
    })
    useEffect(() => {
        if (error) {
            console.error("Failed to fetch sprint data:", error)
        }
    }, [error])
    return <>{isLoading ? <div>Loading...</div> : sprint && (sprint.map((sprintItem) => <div key={sprintItem.id}>{sprintItem.name}</div>))}</>
}