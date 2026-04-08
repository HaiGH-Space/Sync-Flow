'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Issue } from '@/lib/api/issue'

type PlanningIssueCardProps = {
  issue: Issue
  priorityLabel: string
  actionLabel: string
  onAction: (issue: Issue) => void
  disabled?: boolean
  isPending?: boolean
}

const PlanningIssueCard = function PlanningIssueCard({
  issue,
  priorityLabel,
  actionLabel,
  onAction,
  disabled,
  isPending,
}: PlanningIssueCardProps) {
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

export default PlanningIssueCard
