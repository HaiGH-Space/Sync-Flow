'use client';
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateIssue } from "@/hooks/mutations/issue";
import { useProfile } from "@/hooks/use-profile";
import { createDateFormatter } from "@/lib/format-date";
import { Priority, type Issue, type Priority as PriorityType } from "@/lib/api/issue";
import { cn } from "@/lib/utils";
import { createColumnsQueryOptions } from "@/queries/column";
import { createIssueQueryOptions } from "@/queries/issue";
import { createWorkspaceMemberProfilesQueryOptions } from "@/queries/workspace-member";
import { useQuery } from "@tanstack/react-query";
import { Flag, User2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

interface IssueDetailDialogProps {
    isOpen: boolean;
    openChange: (open: boolean) => void;
    projectId: string;
    issueId: string;
}

export default function IssueDetailDialog({ isOpen, openChange, projectId, issueId }: IssueDetailDialogProps) {
    const tDashboard = useTranslations('dashboard');
    const { data: profile } = useProfile();
    const params = useParams<{ workspaceId: string }>();
    const workspaceId = params.workspaceId;

    const { data: issue, isLoading, isError } = useQuery(
        createIssueQueryOptions({ projectId, issueId }, {
            enabled: !!issueId && isOpen,
            select: (response) => response.data,
        })
    );

    const { data: memberProfilesResponse } = useQuery(createWorkspaceMemberProfilesQueryOptions({ workspaceId }, {
        enabled: !!workspaceId && isOpen,
    }));

    const { data: columnsResponse } = useQuery(createColumnsQueryOptions({ projectId }, {
        enabled: !!projectId && isOpen,
    }));

    const { mutate: updateIssue, isPending: isUpdating } = useUpdateIssue(projectId);

    const assigneeOptions = useMemo(() => {
        const members = memberProfilesResponse?.data ?? [];

        return [
            { value: 'UNASSIGNED', label: tDashboard('issue.assignee.unassigned') },
            ...members.map((member) => ({
                value: member.id,
                label: profile?.id === member.id ? tDashboard('issue.assignee.me', { name: member.name }) : member.name,
            })),
        ];
    }, [memberProfilesResponse?.data, profile?.id, tDashboard]);

    const memberNameById = useMemo(() => {
        const entries = (memberProfilesResponse?.data ?? []).map((member) => [member.id, member.name] as const);
        return new Map(entries);
    }, [memberProfilesResponse?.data]);

    const columnNameById = useMemo(() => {
        const entries = (columnsResponse?.data ?? []).map((column) => [column.id, column.name] as const);
        return new Map(entries);
    }, [columnsResponse?.data]);

    return (
        <Dialog open={isOpen} onOpenChange={openChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {isLoading ? (
                    <>
                        <DialogTitle className="sr-only">{tDashboard('issue.detail.loadingTitle')}</DialogTitle>
                        <IssueDetailSkeleton />
                    </>
                ) : isError || !issue ? (
                    <>
                        <DialogTitle className="sr-only">{tDashboard('issue.detail.errorTitle')}</DialogTitle>
                        <DialogDescription className="sr-only">{tDashboard('issue.detail.errorDescription')}</DialogDescription>
                        <IssueDetailSkeleton />
                    </>
                ) : (
                    <>
                        <DialogHeader className="px-1">
                            <DialogTitle className="text-2xl font-semibold">
                                {tDashboard('issue.detail.dialogTitle', { number: String(issue.number), title: issue.title })}
                            </DialogTitle>
                        </DialogHeader>

                        <IssueDetailEditableContent
                            key={issue.id}
                            issue={issue}
                            assigneeOptions={assigneeOptions}
                            reporterName={memberNameById.get(issue.reporterId) ?? issue.reporterId}
                            statusName={columnNameById.get(issue.columnId) ?? issue.columnId}
                            isUpdating={isUpdating}
                            onSave={(values) => {
                                updateIssue({
                                    projectId,
                                    issueId: issue.id,
                                    issueData: values,
                                }, {
                                    onSuccess: () => {
                                        toast.success(tDashboard('issue.toast.updated'));
                                    },
                                    onError: () => {
                                        toast.error(tDashboard('issue.toast.updateFailed'));
                                    },
                                });
                            }}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

type AssigneeOption = {
    value: string;
    label: string;
};

interface IssueDetailEditableContentProps {
    issue: Issue;
    assigneeOptions: AssigneeOption[];
    reporterName: string;
    statusName: string;
    isUpdating: boolean;
    onSave: (values: { description: string; assigneeId: string | null; priority: PriorityType }) => void;
}

function IssueDetailEditableContent({ issue, assigneeOptions, reporterName, statusName, isUpdating, onSave }: IssueDetailEditableContentProps) {
    const tDashboard = useTranslations('dashboard');
    const locale = useLocale();
    const [description, setDescription] = useState(issue.description ?? '');
    const [assigneeId, setAssigneeId] = useState(issue.assigneeId ?? 'UNASSIGNED');
    const [priority, setPriority] = useState<PriorityType>(issue.priority);

    const formatDate = useMemo(() => createDateFormatter(locale), [locale]);

    const priorityOptions = [
        { value: Priority.LOW, label: tDashboard('issue.priority.low') },
        { value: Priority.MEDIUM, label: tDashboard('issue.priority.medium') },
        { value: Priority.HIGH, label: tDashboard('issue.priority.high') },
    ] as const;

    const priorityLabel = priorityOptions.find((option) => option.value === priority)?.label ?? priority;

    const normalizedAssigneeId = assigneeId === 'UNASSIGNED' ? null : assigneeId;

    const isDirty =
        description !== (issue.description ?? '') ||
        normalizedAssigneeId !== (issue.assigneeId ?? null) ||
        priority !== issue.priority;

    return (
        <ScrollArea className="flex-1 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                {/* Details and COMMENTS */}
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h3 className="font-medium mb-2">{tDashboard('issue.detail.descriptionLabel')}</h3>
                        <textarea
                            className="w-full min-h-35 rounded-md border bg-muted/30 p-4 text-sm text-foreground/80 leading-relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            placeholder={tDashboard('issue.detail.descriptionPlaceholder')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="font-medium">{tDashboard('issue.detail.commentsLabel')}</h3>
                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-muted p-3 rounded-lg border text-sm text-muted-foreground cursor-text hover:bg-muted/80 transition-colors">
                                {tDashboard('issue.detail.commentPlaceholder')}
                            </div>
                        </div>
                        <div className="flex justify-center py-8 border-dashed border-2 rounded-lg">
                            <p className="text-sm text-muted-foreground">{tDashboard('issue.detail.noComments')}</p>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase text-muted-foreground">{tDashboard('issue.detail.statusLabel')}</span>
                            <div><Badge variant="secondary">{statusName}</Badge></div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase text-muted-foreground">{tDashboard('issue.form.assigneeLabel')}</span>
                            <div className="space-y-2">
                                <Select value={assigneeId} onValueChange={setAssigneeId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={tDashboard('issue.form.assigneePlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assigneeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src="" />
                                        <AvatarFallback><User2 className="w-3 h-3" /></AvatarFallback>
                                    </Avatar>
                                    <span>{assigneeOptions.find((option) => option.value === assigneeId)?.label || tDashboard('issue.assignee.unassigned')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase text-muted-foreground">{tDashboard('issue.form.priorityLabel')}</span>
                            <div className="space-y-2">
                                <Select value={priority} onValueChange={(value) => setPriority(value as PriorityType)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={tDashboard('issue.form.priorityPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                    <Flag className={cn("w-4 h-4",
                                        priority === 'HIGH' ? "text-red-500" :
                                            priority === 'MEDIUM' ? "text-yellow-500" : "text-green-500"
                                    )} />
                                    <span className="text-sm">{priorityLabel}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <Button
                            className="w-full"
                            onClick={() => onSave({ description, assigneeId: normalizedAssigneeId, priority })}
                            disabled={!isDirty || isUpdating}
                        >
                            {isUpdating ? tDashboard('issue.update.submitting') : tDashboard('issue.detail.saveChanges')}
                        </Button>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">{tDashboard('issue.detail.reporterLabel')}</span>
                                <span className="font-medium text-xs truncate max-w-30">{reporterName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">{tDashboard('issue.detail.createdAtLabel')}</span>
                                <span className="text-xs">{formatDate(issue.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">{tDashboard('issue.detail.updatedAtLabel')}</span>
                                <span className="text-xs">{formatDate(issue.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}

function IssueDetailSkeleton() {
    return (
        <>
            <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-3/4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-10 flex-1" />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ))}
                    <Separator />
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            </div>
        </>
    );
}