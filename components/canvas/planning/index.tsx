'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { createIssuesQueryOptions } from '@/queries/issue'
import { createSprintsQueryOptions } from '@/queries/sprint'
import { useDashboard } from '@/lib/store/use-dashboard'
import { useUpdateIssue } from '@/hooks/mutations/issue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Issue } from '@/lib/api/issue'

type PlanningCanvasProps = {
  projectId: string
}

type IssueCardProps = {
  issue: Issue
  priorityLabel: string
  actionLabel: string
  onAction: (issue: Issue) => void
  disabled?: boolean
  isPending?: boolean
}

function IssueCard({ issue, priorityLabel, actionLabel, onAction, disabled, isPending }: IssueCardProps) {
  return (
    <div className="rounded-lg border border-border/70 bg-background p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">#{issue.number}</div>
          <div className="text-sm font-medium text-foreground line-clamp-2">{issue.title}</div>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {priorityLabel}
        </Badge>
      </div>
      <div className="mt-3 flex items-center justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled || isPending}
          onClick={() => onAction(issue)}
        >
          {isPending ? '...' : actionLabel}
        </Button>
      </div>
    </div>
  )
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

  const issues = useMemo(() => issuesResponse?.data ?? [], [issuesResponse?.data])
  const selectedSprint = useMemo(
    () => sprintsResponse?.data?.find((sprint) => sprint.id === selectedSprintId) ?? null,
    [selectedSprintId, sprintsResponse?.data]
  )

  const isSprintSelected = selectedSprintId !== 'all' && !!selectedSprint

  const unassignedIssues = useMemo(
    () => issues.filter((issue) => !issue.sprintId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [issues]
  )

  const selectedSprintIssues = useMemo(
    () => issues.filter((issue) => issue.sprintId === selectedSprintId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [issues, selectedSprintId]
  )

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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">{tDashboard('planning.unassignedTitle')}</h2>
            <p className="text-xs text-muted-foreground">{tDashboard('planning.unassignedHint')}</p>
          </div>
          <span className="text-xs text-muted-foreground">{unassignedIssues.length}</span>
        </div>

        {unassignedIssues.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            {tDashboard('planning.emptyUnassigned')}
          </div>
        ) : (
          <div className="space-y-3">
            {unassignedIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                priorityLabel={getPriorityLabel(issue.priority)}
                actionLabel={tDashboard('planning.moveToSprint')}
                onAction={handleAssignToSprint}
                disabled={!isSprintSelected}
                isPending={isPending && pendingIssueId === issue.id}
              />
            ))}
          </div>
        )}

        {!isSprintSelected && (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
            {tDashboard('planning.selectSprintHint')}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">
              {tDashboard('planning.sprintTitle')}
            </h2>
            <p className={cn('text-xs', isSprintSelected ? 'text-muted-foreground' : 'text-destructive')}>
              {isSprintSelected
                ? selectedSprint?.name
                : tDashboard('planning.sprintNotSelected')}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{selectedSprintIssues.length}</span>
        </div>

        {selectedSprintIssues.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            {tDashboard('planning.emptySprint')}
          </div>
        ) : (
          <div className="space-y-3">
            {selectedSprintIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                priorityLabel={getPriorityLabel(issue.priority)}
                actionLabel={tDashboard('planning.removeFromSprint')}
                onAction={handleRemoveFromSprint}
                disabled={!isSprintSelected}
                isPending={isPending && pendingIssueId === issue.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
