"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FieldAnimation from "@/components/auth/FieldAnimation";
import type { Sprint } from "@/lib/api/sprint";
import { useUpdateSprint } from "@/hooks/mutations/sprint";
import DatePickerField from "@/components/shared/DatePickerField";

type EditSprintModalProps = {
  projectId: string;
  sprint: Sprint | null;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

const editSprintSchema = (
  tValidation: ReturnType<typeof useTranslations<"validation">>,
) =>
  z
    .object({
      name: z.string().min(1, tValidation("sprint.name_required")),
      goal: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    })
    .refine(
      (values) => {
        if (!values.startDate || !values.endDate) return true;
        return new Date(values.endDate) >= new Date(values.startDate);
      },
      {
        message: tValidation("sprint.end_date_after_start"),
        path: ["endDate"],
      },
    );

type FormSchema = z.infer<ReturnType<typeof editSprintSchema>>;

function toInputDate(value: string | null) {
  if (!value) return "";
  return format(new Date(value), "yyyy-MM-dd");
}

function toIsoDateTime(value?: string) {
  if (!value?.trim()) return null;
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export default function EditSprintModal({
  projectId,
  sprint,
  open,
  onOpenChangeAction,
}: EditSprintModalProps) {
  const tDashboard = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const schema = editSprintSchema(tValidation);
  const { mutate: updateSprint, isPending } = useUpdateSprint(projectId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSprint = sprint ?? {
    id: "",
    name: "",
    goal: null,
    startDate: null,
    endDate: null,
    projectId,
    createdAt: "",
    updatedAt: "",
    status: "PLANNED" as const,
  };

  const form = useForm({
    defaultValues: {
      name: selectedSprint.name,
      goal: selectedSprint.goal ?? "",
      startDate: toInputDate(selectedSprint.startDate),
      endDate: toInputDate(selectedSprint.endDate),
    } satisfies FormSchema,
    validators: {
      onSubmit: schema,
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      updateSprint(
        {
          projectId,
          sprintId: selectedSprint.id,
          sprint: {
            name: value.name,
            goal: value.goal?.trim() ? value.goal : null,
            startDate: toIsoDateTime(value.startDate),
            endDate: toIsoDateTime(value.endDate),
          },
        },
        {
          onSuccess: () => {
            toast.success(tDashboard("sprint.toast.updated"));
            setIsSubmitting(false);
            onOpenChangeAction(false);
          },
          onError: () => {
            toast.error(tDashboard("sprint.toast.updateFailed"));
            setIsSubmitting(false);
          },
        },
      );
    },
  });

  if (!sprint) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tDashboard("sprint.edit.title")}</DialogTitle>
          <DialogDescription>
            {tDashboard("sprint.edit.description", { name: sprint.name })}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldAnimation
            form={form}
            name="name"
            placeholder={tDashboard("sprint.edit.namePlaceholder")}
          />
          <FieldAnimation
            form={form}
            name="goal"
            placeholder={tDashboard("sprint.edit.goalPlaceholder")}
          />
          <DatePickerField
            form={form}
            name="startDate"
            label={tDashboard("sprint.edit.startDateLabel")}
            placeholder={tDashboard("sprint.edit.startDateLabel")}
          />
          <DatePickerField
            form={form}
            name="endDate"
            label={tDashboard("sprint.edit.endDateLabel")}
            placeholder={tDashboard("sprint.edit.endDateLabel")}
          />

          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={isPending || isSubmitting}
          >
            {isPending || isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                {tCommon("status.saving")}
              </>
            ) : (
              <>
                <PencilIcon className="mr-2 size-4" />
                {tDashboard("sprint.edit.submit")}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
