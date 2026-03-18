'use client'
import { memo, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { useDraggable } from '@dnd-kit/react';
import { Priority } from "@/lib/api/issue"
import DropdownMenuUD from "../shared/DropdownMenuUD";
import { toast } from "sonner";
import DeleteConfirmModal from "../dashboard/comp/DeleteConfirmModal";
import { useDeleteIssue } from "@/hooks/mutations/issue";
import UpdateIssueModal from "../dashboard/comp/UpdateIssueModal";
import { useTranslations } from "next-intl";

type KanbanCardProps = {
    id: string
    title: string
    projectId: string
    description?: string
    storyPoint?: number
    priority?: Priority
    assigneeId?: string | null
}

function KanbanCard(props: KanbanCardProps) {
    const { mutate: deleteIssue, isPending } = useDeleteIssue(props.projectId)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const tDashboard = useTranslations('dashboard')
    const { ref, isDragging } = useDraggable({
        id: props.id,
        data: { type: 'task', ...props }
    })
    return (
        <div ref={ref} className={cn("duration-200 hover:border-primary cursor-grab w-full min-w-48 p-3 mb-2 flex flex-col bg-card border rounded-lg", isDragging && "opacity-90 border-dashed")}>
            <div className="flex justify-between">
                <h4 className="font-medium">{props.title}</h4>
                <DropdownMenuUD
                    onEdit={() => setIsEditModalOpen(true)}
                    onDelete={() => setIsDeleteModalOpen(true)} />
            </div>
            {props.description && <p className="text-sm text-muted-foreground">{props.description}</p>}
            <div className="flex justify-between mt-2">
                <div>
                    {props.priority &&
                        <Badge className={cn('mr-2', props.priority === Priority.HIGH ? 'bg-red-900 text-red-300' : props.priority === Priority.MEDIUM ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300')}>
                            {props.priority.charAt(0).toUpperCase() + props.priority.slice(1)}
                        </Badge>
                    }
                    {props.storyPoint && <span className="text-sm text-muted-foreground">SP: {props.storyPoint}</span>}
                </div>
                <div>
                    <Avatar className="w-6 h-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                </div>
            </div>

            {isDeleteModalOpen && (
                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    title={tDashboard('issue.delete.title', { title: props.title })}
                    description={tDashboard('issue.delete.description')}
                    onConfirm={() => {
                        deleteIssue({
                            issueId: props.id,
                            projectId: props.projectId
                        }, {
                            onSuccess: () => {
                                toast.success(tDashboard('issue.toast.deleted'))
                            },
                            onError: () => {
                                toast.error(tDashboard('issue.toast.deleteFailed'))
                            }
                        });
                    }}
                    onClose={setIsDeleteModalOpen}
                    isLoading={isPending}
                />
            )}

            {isEditModalOpen && (
                <UpdateIssueModal
                    isOpen={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    projectId={props.projectId}
                    issueId={props.id}
                    defaultValues={{
                        title: props.title,
                        description: props.description,
                        priority: props.priority,
                        assigneeId: props.assigneeId,
                    }}
                />
            )}
        </div>
    )
}

export default memo(KanbanCard);