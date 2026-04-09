'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Issue } from '@/lib/api/issue'
import { cn } from '@/lib/utils'
import IssueDetailDialog from '@/components/dashboard/comp/IssueDetailDialog'

type PlanningIssueCardProps = {
  projectId: string
  issue: Issue
  priorityLabel: string
  actionLabel: string
  onAction: (issue: Issue) => void
  disabled?: boolean
  isPending?: boolean
}

const PlanningIssueCard = function PlanningIssueCard({
  projectId,
  issue,
  priorityLabel,
  actionLabel,
  onAction,
  disabled,
  isPending,
}: PlanningIssueCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { ref, isDragging } = useDraggable({
    id: issue.id,
    data: { type: 'planning-issue', issue },
  })

  return (
    <>
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={() => setIsDetailOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsDetailOpen(true)
          }
        }}
        className={cn(
          'rounded-lg border border-border/70 bg-background p-3 shadow-sm cursor-grab transition-opacity',
          isDragging && 'opacity-70 border-dashed'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">#{issue.number}</div>
            <div className="text-sm font-medium text-foreground line-clamp-2">{issue.title}</div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {priorityLabel}
          </Badge>
        </div>
        <div className="flex items-center justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled || isPending}
            onClick={(event) => {
              event.stopPropagation()
              onAction(issue)
            }}
          >
            {isPending ? '...' : actionLabel}
          </Button>
        </div>
      </div>

      <IssueDetailDialog
        isOpen={isDetailOpen}
        openChange={setIsDetailOpen}
        projectId={projectId}
        issueId={issue.id}
      />
    </>
  )
}

export default PlanningIssueCard
