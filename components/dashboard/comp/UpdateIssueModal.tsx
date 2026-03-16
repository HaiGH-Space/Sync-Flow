'use client'

import { toast } from 'sonner'
import { Priority } from '@/lib/api/issue'
import { useUpdateIssue } from '@/hooks/mutations/issue'
import IssueFormDialog, { type IssueFormValues } from './IssueFormDialog'

type UpdateIssueModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  issueId: string
  defaultValues: {
    title: string
    description?: string
    priority?: Priority
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
      defaultValues={{
        title: defaultValues.title,
        description: defaultValues.description ?? '',
        priority: defaultValues.priority ?? Priority.MEDIUM,
      }}
      onSubmit={handleSubmit}
    />
  )
}
