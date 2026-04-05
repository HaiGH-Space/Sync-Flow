'use client'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { format } from 'date-fns'
import { PlusIcon, Loader2Icon, CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import FieldErrorAnimation from '@/components/shared/FieldErrorAnimation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import FieldAnimation from '@/components/auth/FieldAnimation'
import { useCreateSprint } from '@/hooks/mutations/sprint'
import { cn } from '@/lib/utils'

type CreateSprintModalProps = {
  projectId: string
  onCreated?: (sprintId: string) => void
}

const createSprintSchema = (tValidation: ReturnType<typeof useTranslations<'validation'>>) =>
  z
    .object({
      name: z.string().min(1, tValidation('sprint.name_required')),
      goal: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .refine(
      (values) => {
        if (!values.startDate || !values.endDate) {
          return true
        }
        return new Date(values.endDate) >= new Date(values.startDate)
      },
      {
        message: tValidation('sprint.end_date_after_start'),
        path: ['endDate'],
      }
    )

type FormSchema = z.infer<ReturnType<typeof createSprintSchema>>

const defaultValues: FormSchema = {
  name: '',
  goal: '',
  startDate: '',
  endDate: '',
}

export default function CreateSprintModal({ projectId, onCreated }: CreateSprintModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tDashboard = useTranslations('dashboard')
  const tCommon = useTranslations('common')
  const tValidation = useTranslations('validation')
  const schema = createSprintSchema(tValidation)
  const { mutate: createSprint, isPending } = useCreateSprint(projectId)

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: schema,
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      createSprint(
        {
          projectId,
          sprint: {
            projectId,
            name: value.name,
            goal: value.goal?.trim() ? value.goal : null,
            startDate: value.startDate?.trim() ? value.startDate : null,
            endDate: value.endDate?.trim() ? value.endDate : null,
          },
        },
        {
          onSuccess: (response) => {
            toast.success(tDashboard('sprint.toast.created'))
            onCreated?.(response.data.id)
            handleOpenChange(false)
          },
          onError: () => {
            toast.error(tDashboard('sprint.toast.createFailed'))
          },
        }
      )
    },
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setTimeout(() => {
        form.reset()
      }, 300)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon-sm" aria-label={tDashboard('sprint.create.action')}>
          <PlusIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tDashboard('sprint.create.title')}</DialogTitle>
          <DialogDescription>{tDashboard('sprint.create.description')}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldAnimation form={form} name="name" placeholder={tDashboard('sprint.create.namePlaceholder')} />
          <FieldAnimation form={form} name="goal" placeholder={tDashboard('sprint.create.goalPlaceholder')} />
          <DatePickerField
            form={form}
            name="startDate"
            label={tDashboard('sprint.create.startDateLabel')}
            placeholder={tDashboard('sprint.create.startDateLabel')}
          />
          <DatePickerField
            form={form}
            name="endDate"
            label={tDashboard('sprint.create.endDateLabel')}
            placeholder={tDashboard('sprint.create.endDateLabel')}
          />

          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                {tCommon('status.creating')}
              </>
            ) : (
              tDashboard('sprint.create.submit')
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DatePickerField({
  form,
  name,
  label,
  placeholder,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  name: string
  label: string
  placeholder: string
}) {
  return (
    <div className="mt-4">
      <form.Field name={name}>
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (field: any) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            const selectedDate = field.state.value ? new Date(field.state.value) : undefined

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={field.name}
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-between text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      {selectedDate ? format(selectedDate, 'PPP') : placeholder}
                      <CalendarIcon className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        field.handleChange(date ? format(date, 'yyyy-MM-dd') : '')
                      }}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                <FieldErrorAnimation isInvalid={isInvalid} errors={field.state.meta.errors} />
              </Field>
            )
          }
        }
      </form.Field>
    </div>
  )
}
