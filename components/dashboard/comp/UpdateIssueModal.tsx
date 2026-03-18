'use client'

import { toast } from 'sonner'
import { Priority } from '@/lib/api/issue'
import { useUpdateIssue } from '@/hooks/mutations/issue'
import IssueFormDialog, { type IssueFormValues } from './IssueFormDialog'
import { useProfile } from '@/hooks/use-profile'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '@/lib/api/api'
import { createWorkspaceMemberProfilesQueryOptions } from '@/queries/workspace-member'
import { useTranslations } from 'next-intl'

type UpdateIssueModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  issueId: string
  defaultValues: {
    title: string
    description?: string
    priority?: Priority
    assigneeId?: string | null
  }
}

export default function UpdateIssueModal({
  isOpen,
  onOpenChange,
  projectId,
  issueId,
  defaultValues,
}: UpdateIssueModalProps) {
  const { mutate: updateIssue, isPending } = useUpdateIssue(projectId)
  const { data: profile } = useProfile()
  const tDashboard = useTranslations('dashboard')
  const params = useParams<{ workspaceId?: string }>()
  const workspaceId = params.workspaceId

  const { data: memberProfilesResponse } = useQuery(
    workspaceId
      ? createWorkspaceMemberProfilesQueryOptions({ workspaceId })
      : {
          queryKey: ['workspace-members', 'profiles', 'missing-workspaceId'],
          queryFn: async () => ({ data: [], message: '', statusCode: 200 } as ApiResponse<never>),
          enabled: false,
        },
  )

  const assigneeOptions = memberProfilesResponse?.data
    ? memberProfilesResponse.data.map((u) => ({
        value: u.id,
        label: profile?.id === u.id ? tDashboard('issue.assignee.me', { name: u.name }) : u.name,
      }))
    : undefined

  const handleSubmit = async (values: IssueFormValues) => {
    updateIssue(
      {
        projectId,
        issueId,
        issueData: {
          title: values.title,
          description: values.description,
          priority: values.priority,
          assigneeId: values.assigneeId ?? null,
        },
      },
      {
        onSuccess: () => {
          toast.success(tDashboard('issue.toast.updated'))
          onOpenChange(false)
        },
        onError: () => {
          toast.error(tDashboard('issue.toast.updateFailed'))
        },
      },
    )
  }

  return (
    <IssueFormDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      dialogTitle={tDashboard('issue.update.title')}
      dialogDescription={tDashboard('issue.update.description')}
      submitLabel={tDashboard('issue.update.submit')}
      submittingLabel={tDashboard('issue.update.submitting')}
      isSubmitting={isPending}
      assigneeOptions={assigneeOptions}
      defaultValues={{
        title: defaultValues.title,
        description: defaultValues.description ?? '',
        priority: defaultValues.priority ?? Priority.MEDIUM,
        assigneeId: defaultValues.assigneeId ?? 'UNASSIGNED',
      }}
      onSubmit={handleSubmit}
    />
  )
}
