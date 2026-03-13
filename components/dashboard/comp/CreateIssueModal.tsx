'use client'
import { useState } from "react";
import { z } from "zod";
import { CreateIssue, Issue, Priority } from "@/lib/api/issue";
import { useForm } from "@tanstack/react-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import FieldAnimation, { SelectAnimation } from "@/components/auth/FieldAnimation";
import { useCreateIssue } from "@/hooks/mutations/issue";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/api/api";
import { issueKeys } from "@/queries/issue";
import { toast } from "sonner";

const createIssueSchema = z.object({
    title: z.string().min(1, "Issue title is required"),
    priority: z.enum(Priority),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
})

type formSchema = z.infer<typeof createIssueSchema>

const defaultValues: formSchema = {
    title: "",
    priority: "MEDIUM",
    description: "",
}

interface CreateIssueModalProps {
    columnId: string;
    projectId: string;
}

export default function CreateIssueModal({ columnId, projectId }: CreateIssueModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { mutate: createIssue, isPending } = useCreateIssue(projectId);
    const queryClient = useQueryClient();

    const form = useForm({
        defaultValues: defaultValues,
        validators: {
            onSubmit: createIssueSchema,
            onChange: createIssueSchema
        },
        onSubmit: async ({ value }) => {
            const cachedIssues = queryClient.getQueryData<ApiResponse<Issue[]>>(issueKeys.list(projectId));
            let newOrder = 1000;
            if (cachedIssues?.data) {
                const columnIssues = cachedIssues.data
                    .filter(issue => issue.columnId === columnId)
                    .sort((a, b) => a.order - b.order);

                if (columnIssues.length > 0) {
                    const lastIssue = columnIssues[columnIssues.length - 1];
                    newOrder = lastIssue.order + 1000;
                }
            }
            const issueData: CreateIssue = {
                order: newOrder,
                columnId,
                title: value.title,
                priority: value.priority,
                description: value.description,
                assigneeId: value.assigneeId,
            }
            createIssue({ projectId, issueData },{
                onSuccess: () => {
                    toast.success("Issue created successfully");
                    handleOpenChange(false);
                },
                onError: () => {
                    toast.error("Failed to create issue");
                }
            });
        },
    })

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setTimeout(() => {
                form.reset();
            }, 300);
        }
    }

    const priorityOptions = Object.values(Priority).map((val) => ({
        value: val,
        label: val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
    }));
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="ghost" size="icon">
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Issue</DialogTitle>
                    <DialogDescription>
                        {`Create a new issue in.`}
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="create-issue-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <FieldAnimation form={form} name="title" placeholder="Issue Title" />
                    <FieldAnimation form={form} name="description" placeholder="Issue Description (optional)" />
                    <SelectAnimation
                        form={form}
                        name="priority"
                        placeholder="Issue Priority"
                        fieldLabel="Priority"
                        data={priorityOptions}
                    />
                    <Button
                        type="submit"
                        className="mt-4 cursor-pointer w-full"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Issue"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}