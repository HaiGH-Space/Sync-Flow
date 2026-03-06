'use client'
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { issueService, Priority } from "@/lib/services/issue";
import { useForm } from "@tanstack/react-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import FieldAnimation from "@/components/auth/FieldAnimation";
import { toast } from "sonner";

const createIssueSchema = z.object({
    title: z.string().min(1, "Issue title is required"),
    priority: z.enum(Priority),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
    columnId: z.string()
})

type formSchema = z.infer<typeof createIssueSchema>

const defaultValues: formSchema = {
    title: "",
    priority: "MEDIUM",
    columnId: ""
}

export default function CreateIssueModal() {
    const [isOpen, setIsOpen] = useState(false)
    // const queryClient = useQueryClient()
    const { mutate: createIssue, isPending } = useMutation({
        mutationFn: issueService.createIssue,
        onSuccess: async () => {
            // await queryClient.invalidateQueries({ queryKey: ['issues', workspaceDetail?.id] });
            toast.success("Issue created successfully");
            handleOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to create issue");
        }
    })
    
    const form = useForm({
        defaultValues: defaultValues,
        validators: {
            onSubmit: createIssueSchema,
            onChange: createIssueSchema
        },
        onSubmit: async ({ value }) => {
            console.log("Creating issue with values:", value)
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
                    <FieldAnimation form={form} name="priority" placeholder="Issue Priority" />
                    <FieldAnimation form={form} name="description" placeholder="Issue Description (optional)" />
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