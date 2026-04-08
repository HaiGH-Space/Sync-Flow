'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { createIssuesQueryOptions } from '@/queries/issue'
import { createSprintsQueryOptions } from '@/queries/sprint'
import { useDashboard } from '@/lib/store/use-dashboard'
import { useUpdateIssue } from '@/hooks/mutations/issue'
import type { Issue } from '@/lib/api/issue'
import PlanningIssuesColumn from './PlanningIssuesColumn'

type PlanningCanvasProps = {
  projectId: string
}


export default function PlanningCanvas({ projectId }: PlanningCanvasProps) {
  const tDashboard = useTranslations('dashboard')
  const selectedSprintId = useDashboard((state) => state.selectedSprintId)
  const { mutate: updateIssue, isPending } = useUpdateIssue(projectId)
  const [pendingIssueId, setPendingIssueId] = useState<string | null>(null)

  const { data: issuesResponse, isLoading, error } = useQuery(
    createIssuesQueryOptions({ projectId })
  )

  const { data: sprintsResponse } = useQuery(
    createSprintsQueryOptions(
      { projectId },
      { enabled: !!projectId }
    )
  )

  const issues = issuesResponse?.data ?? []
  const selectedSprint = sprintsResponse?.data?.find((sprint) => sprint.id === selectedSprintId) ?? null

  const isSprintSelected = selectedSprintId !== 'all' && !!selectedSprint

  const unassignedIssues = issues
    .filter((issue) => !issue.sprintId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const selectedSprintIssues = issues
    .filter((issue) => issue.sprintId === selectedSprintId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const getPriorityLabel = (priority: Issue['priority']) => {
    if (priority === 'HIGH') return tDashboard('issue.priority.high')
    if (priority === 'MEDIUM') return tDashboard('issue.priority.medium')
    return tDashboard('issue.priority.low')
  }

  const handleAssignToSprint = (issue: Issue) => {
    if (!isSprintSelected) return
    setPendingIssueId(issue.id)
    updateIssue(
      { projectId, issueId: issue.id, issueData: { sprintId: selectedSprintId } },
      {
        onSuccess: () => {
          toast.success(tDashboard('issue.toast.updated'))
        },
        onError: () => {
          toast.error(tDashboard('issue.toast.updateFailed'))
        },
        onSettled: () => {
          setPendingIssueId(null)
        },
      }
    )
  }

  const handleRemoveFromSprint = (issue: Issue) => {
    setPendingIssueId(issue.id)
    updateIssue(
      { projectId, issueId: issue.id, issueData: { sprintId: null } },
      {
        onSuccess: () => {
          toast.success(tDashboard('issue.toast.updated'))
        },
        onError: () => {
          toast.error(tDashboard('issue.toast.updateFailed'))
        },
        onSettled: () => {
          setPendingIssueId(null)
        },
      }
    )
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">{tDashboard('planning.loading')}</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">{tDashboard('planning.error')}</div>
  }

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
      <PlanningIssuesColumn
        title={tDashboard('planning.unassignedTitle')}
        subtitle={tDashboard('planning.unassignedHint')}
        count={unassignedIssues.length}
        emptyText={tDashboard('planning.emptyUnassigned')}
        issues={unassignedIssues}
        actionLabel={tDashboard('planning.moveToSprint')}
        onAction={handleAssignToSprint}
        getPriorityLabel={getPriorityLabel}
        disabled={!isSprintSelected}
        pendingIssueId={isPending ? pendingIssueId : null}
        footer={!isSprintSelected ? (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
            {tDashboard('planning.selectSprintHint')}
          </div>
        ) : null}
      />

      <PlanningIssuesColumn
        title={tDashboard('planning.sprintTitle')}
        subtitle={isSprintSelected ? selectedSprint?.name ?? '' : tDashboard('planning.sprintNotSelected')}
        subtitleTone={isSprintSelected ? 'default' : 'warning'}
        count={selectedSprintIssues.length}
        emptyText={tDashboard('planning.emptySprint')}
        issues={selectedSprintIssues}
        actionLabel={tDashboard('planning.removeFromSprint')}
        onAction={handleRemoveFromSprint}
        getPriorityLabel={getPriorityLabel}
        disabled={!isSprintSelected}
        pendingIssueId={isPending ? pendingIssueId : null}
      />
    </div>
  )
}
