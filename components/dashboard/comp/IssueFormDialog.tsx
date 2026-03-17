'use client'

import { useEffect, useMemo, type ReactNode } from 'react'
import { z } from 'zod'
import { Priority } from '@/lib/api/issue'
import { useForm } from '@tanstack/react-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import FieldAnimation, { SelectAnimation } from '@/components/auth/FieldAnimation'

export const issueFormSchema = z.object({
  title: z.string().min(1, 'Issue title is required'),
  priority: z.enum(Priority),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
})

export type IssueFormValues = z.infer<typeof issueFormSchema>

const baseDefaultValues: IssueFormValues = {
  title: '',
  priority: 'MEDIUM',
  description: '',
  assigneeId: 'UNASSIGNED',
}

export type AssigneeOption = { value: string; label: string }

type IssueFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dialogTitle: string
  dialogDescription?: string
  children?: ReactNode
  assigneeOptions?: AssigneeOption[]
  submitLabel: string
  submittingLabel?: string
  isSubmitting?: boolean
  defaultValues?: Partial<IssueFormValues>
  onSubmit: (values: IssueFormValues) => void | Promise<void>
}

export default function IssueFormDialog({
  open,
  onOpenChange,
  dialogTitle,
  dialogDescription,
  children,
  assigneeOptions,
  submitLabel,
  submittingLabel = 'Saving...',
  isSubmitting = false,
  defaultValues,
  onSubmit,
}: IssueFormDialogProps) {
  const mergedDefaultValues = useMemo<IssueFormValues>(
    () => ({ ...baseDefaultValues, ...defaultValues }),
    [defaultValues],
  )

  const form = useForm({
    defaultValues: mergedDefaultValues,
    validators: {
      onSubmit: issueFormSchema,
      onChange: issueFormSchema,
    },
    onSubmit: async ({ value }) => {
      const normalized: IssueFormValues = {
        ...value,
        assigneeId: value.assigneeId === 'UNASSIGNED' ? undefined : value.assigneeId,
      }
      await onSubmit(normalized)
    },
  })

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        form.reset()
      }, 300)
      return () => clearTimeout(t)
    }
  }, [open, form])

  const priorityOptions = Object.values(Priority).map((val) => ({
    value: val,
    label: val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
  }))

  const normalizedAssigneeOptions = assigneeOptions
    ? [{ value: 'UNASSIGNED', label: 'Unassigned' }, ...assigneeOptions]
    : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription ? (
            <DialogDescription>{dialogDescription}</DialogDescription>
          ) : null}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldAnimation form={form} name="title" placeholder="Issue Title" />
          <FieldAnimation
            form={form}
            name="description"
            placeholder="Issue Description (optional)"
          />
          {normalizedAssigneeOptions ? (
            <SelectAnimation
              form={form}
              name="assigneeId"
              placeholder="Assignee"
              fieldLabel="Assignee"
              data={normalizedAssigneeOptions}
            />
          ) : null}
          <SelectAnimation
            form={form}
            name="priority"
            placeholder="Issue Priority"
            fieldLabel="Priority"
            data={priorityOptions}
          />
          <Button type="submit" className="mt-4 cursor-pointer w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                {submittingLabel}
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
