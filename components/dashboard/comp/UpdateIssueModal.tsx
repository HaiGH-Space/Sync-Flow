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
        label: profile?.id === u.id ? `Me (${u.name})` : u.name,
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
          assigneeId: values.assigneeId,
        },
      },
      {
        onSuccess: () => {
          toast.success('Issue updated successfully')
          onOpenChange(false)
        },
        onError: () => {
          toast.error('Failed to update issue')
        },
      },
    )
  }

  return (
    <IssueFormDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      dialogTitle="Update Issue"
      dialogDescription="Update issue details."
      submitLabel="Update Issue"
      submittingLabel="Updating..."
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
