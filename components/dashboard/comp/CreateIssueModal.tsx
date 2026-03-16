'use client'
import { useState } from "react";
import { CreateIssue, Issue } from "@/lib/api/issue";
import { DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateIssue } from "@/hooks/mutations/issue";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/api/api";
import { issueKeys } from "@/queries/issue";
import { toast } from "sonner";
import IssueFormDialog, { IssueFormValues } from "./IssueFormDialog";

interface CreateIssueModalProps {
    columnId: string;
    projectId: string;
}

export default function CreateIssueModal({ columnId, projectId }: CreateIssueModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { mutate: createIssue, isPending } = useCreateIssue(projectId);
    const queryClient = useQueryClient();

    const handleSubmit = async (value: IssueFormValues) => {
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
                    setIsOpen(false)
                },
                onError: () => {
                    toast.error("Failed to create issue");
                }
            });
    }

    return (
        <IssueFormDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            dialogTitle="Create New Issue"
            dialogDescription="Create a new issue in."
            submitLabel="Create Issue"
            submittingLabel="Creating..."
            isSubmitting={isPending}
            onSubmit={handleSubmit}
        >
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="ghost" size="icon">
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
        </IssueFormDialog>
    )
}