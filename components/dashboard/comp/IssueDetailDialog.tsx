"use client";
import { useMemo, useReducer, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteConfirmModal from "@/components/dashboard/comp/DeleteConfirmModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DropdownMenuUD from "@/components/shared/DropdownMenuUD";
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/mutations/comment";
import { useDeleteIssue, useUpdateIssue } from "@/hooks/mutations/issue";
import { useProfile } from "@/hooks/use-profile";
import { type Comment } from "@/lib/api/comment";
import { createDateFormatter } from "@/lib/format-date";
import {
  Priority,
  type Issue,
  type Priority as PriorityType,
} from "@/lib/api/issue";
import { type UserProfile } from "@/lib/api/user";
import { cn } from "@/lib/utils";
import { createColumnsQueryOptions } from "@/queries/column";
import { createCommentsQueryOptions } from "@/queries/comment";
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

export default function IssueDetailDialog({
  isOpen,
  openChange,
  projectId,
  issueId,
}: IssueDetailDialogProps) {
  const tDashboard = useTranslations("dashboard");
  const { data: profile } = useProfile();
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [updatingCommentId, setUpdatingCommentId] = useState<string | null>(
    null,
  );
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;

  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery(
    createIssueQueryOptions(
      { projectId, issueId },
      {
        enabled: !!issueId && isOpen,
        select: (response) => response.data,
      },
    ),
  );

  const { data: memberProfilesResponse } = useQuery(
    createWorkspaceMemberProfilesQueryOptions(
      { workspaceId },
      {
        enabled: !!workspaceId && isOpen,
      },
    ),
  );

  const { data: columnsResponse } = useQuery(
    createColumnsQueryOptions(
      { projectId },
      {
        enabled: !!projectId && isOpen,
      },
    ),
  );

  const { data: comments = [] } = useQuery(
    createCommentsQueryOptions(
      { issueId },
      {
        enabled: !!issueId && isOpen,
        select: (response) => response.data,
      },
    ),
  );

  const { mutate: updateIssue, isPending: isUpdating } =
    useUpdateIssue(projectId);
  const { mutate: deleteIssue, isPending: isDeletingIssue } =
    useDeleteIssue(projectId);
  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment(issueId);
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment(issueId);
  const { mutate: updateComment, isPending: isUpdatingComment } =
    useUpdateComment(issueId);

  const assigneeOptions = useMemo(() => {
    const members = memberProfilesResponse?.data ?? [];

    return [
      { value: "UNASSIGNED", label: tDashboard("issue.assignee.unassigned") },
      ...members.map((member) => ({
        value: member.id,
        label:
          profile?.id === member.id
            ? tDashboard("issue.assignee.me", { name: member.name })
            : member.name,
      })),
    ];
  }, [memberProfilesResponse?.data, profile?.id, tDashboard]);

  const memberNameById = useMemo(() => {
    const entries = (memberProfilesResponse?.data ?? []).map(
      (member) => [member.id, member.name] as const,
    );
    return new Map(entries);
  }, [memberProfilesResponse?.data]);

  const memberById = useMemo(() => {
    const entries = (memberProfilesResponse?.data ?? []).map(
      (member) => [member.id, member] as const,
    );
    return new Map(entries);
  }, [memberProfilesResponse?.data]);

  const columnNameById = useMemo(() => {
    const entries = (columnsResponse?.data ?? []).map(
      (column) => [column.id, column.name] as const,
    );
    return new Map(entries);
  }, [columnsResponse?.data]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="w-[95vw] md:w-[85vw] max-w-[95vw] md:max-w-[85vw] max-h-[90vh] overflow-hidden flex flex-col">
        {isLoading ? (
          <>
            <DialogTitle className="sr-only">
              {tDashboard("issue.detail.loadingTitle")}
            </DialogTitle>
            <IssueDetailSkeleton />
          </>
        ) : isError || !issue ? (
          <>
            <DialogTitle className="sr-only">
              {tDashboard("issue.detail.errorTitle")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {tDashboard("issue.detail.errorDescription")}
            </DialogDescription>
            <IssueDetailSkeleton />
          </>
        ) : (
          <>
            <DialogHeader className="px-1">
              <DialogTitle className="text-2xl font-semibold">
                {tDashboard("issue.detail.dialogTitle", {
                  number: String(issue.number),
                  title: issue.title,
                })}
              </DialogTitle>
            </DialogHeader>

            <IssueDetailEditableContent
              key={issue.id}
              issue={issue}
              assigneeOptions={assigneeOptions}
              reporterName={
                memberNameById.get(issue.reporterId) ?? issue.reporterId
              }
              statusName={columnNameById.get(issue.columnId) ?? issue.columnId}
              currentUser={profile}
              comments={comments}
              memberById={memberById}
              mutationState={{
                isUpdating,
                isCreatingComment,
                isDeletingComment,
                deletingCommentId,
                isUpdatingComment,
                updatingCommentId,
                isDeletingIssue,
              }}
              onSave={(values) => {
                updateIssue(
                  {
                    projectId,
                    issueId: issue.id,
                    issueData: values,
                  },
                  {
                    onSuccess: () => {
                      toast.success(tDashboard("issue.toast.updated"));
                    },
                    onError: () => {
                      toast.error(tDashboard("issue.toast.updateFailed"));
                    },
                  },
                );
              }}
              onDeleteIssue={() => {
                deleteIssue(
                  {
                    projectId,
                    issueId: issue.id,
                  },
                  {
                    onSuccess: () => {
                      toast.success(tDashboard("issue.toast.deleted"));
                      openChange(false);
                    },
                    onError: () => {
                      toast.error(tDashboard("issue.toast.deleteFailed"));
                    },
                  },
                );
              }}
              onUpdateComment={(commentId, content) => {
                setUpdatingCommentId(commentId);

                updateComment(
                  {
                    issueId: issue.id,
                    commentId,
                    data: { content },
                  },
                  {
                    onSuccess: () => {
                      toast.success(tDashboard("issue.toast.commentUpdated"));
                    },
                    onError: () => {
                      toast.error(
                        tDashboard("issue.toast.commentUpdateFailed"),
                      );
                    },
                    onSettled: () => {
                      setUpdatingCommentId(null);
                    },
                  },
                );
              }}
              onDeleteComment={(commentId) => {
                setDeletingCommentId(commentId);

                deleteComment(
                  {
                    issueId: issue.id,
                    commentId,
                  },
                  {
                    onSuccess: () => {
                      toast.success(tDashboard("issue.toast.commentDeleted"));
                    },
                    onError: () => {
                      toast.error(
                        tDashboard("issue.toast.commentDeleteFailed"),
                      );
                    },
                    onSettled: () => {
                      setDeletingCommentId(null);
                    },
                  },
                );
              }}
              onCreateComment={(content) => {
                if (!profile?.id) {
                  toast.error(tDashboard("issue.toast.commentCreateFailed"));
                  return;
                }

                createComment(
                  {
                    issueId: issue.id,
                    data: {
                      content,
                      userId: profile.id,
                    },
                  },
                  {
                    onSuccess: () => {
                      toast.success(tDashboard("issue.toast.commentCreated"));
                    },
                    onError: () => {
                      toast.error(
                        tDashboard("issue.toast.commentCreateFailed"),
                      );
                    },
                  },
                );
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
  currentUser?: UserProfile;
  comments: Comment[];
  memberById: Map<string, UserProfile>;
  mutationState: {
    isUpdating: boolean;
    isCreatingComment: boolean;
    isDeletingComment: boolean;
    deletingCommentId: string | null;
    isUpdatingComment: boolean;
    updatingCommentId: string | null;
    isDeletingIssue: boolean;
  };
  onSave: (values: {
    description: string;
    assigneeId: string | null;
    priority: PriorityType;
  }) => void;
  onDeleteIssue: () => void;
  onUpdateComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onCreateComment: (content: string) => void;
}

type IssueDetailEditableState = {
  description: string;
  assigneeId: string;
  priority: PriorityType;
  newComment: string;
  editingCommentId: string | null;
  editingCommentContent: string;
  isDeleteIssueDialogOpen: boolean;
};

type IssueDetailEditableAction =
  | { type: "descriptionChanged"; value: string }
  | { type: "assigneeChanged"; value: string }
  | { type: "priorityChanged"; value: PriorityType }
  | { type: "newCommentChanged"; value: string }
  | { type: "startEditingComment"; commentId: string; content: string }
  | { type: "cancelEditingComment" }
  | { type: "deleteIssueDialogOpened" }
  | { type: "deleteIssueDialogClosed" };

function createIssueDetailEditableState(
  issue: Issue,
): IssueDetailEditableState {
  return {
    description: issue.description ?? "",
    assigneeId: issue.assigneeId ?? "UNASSIGNED",
    priority: issue.priority,
    newComment: "",
    editingCommentId: null,
    editingCommentContent: "",
    isDeleteIssueDialogOpen: false,
  };
}

function issueDetailEditableReducer(
  state: IssueDetailEditableState,
  action: IssueDetailEditableAction,
): IssueDetailEditableState {
  switch (action.type) {
    case "descriptionChanged":
      return { ...state, description: action.value };
    case "assigneeChanged":
      return { ...state, assigneeId: action.value };
    case "priorityChanged":
      return { ...state, priority: action.value };
    case "newCommentChanged":
      return { ...state, newComment: action.value };
    case "startEditingComment":
      return {
        ...state,
        editingCommentId: action.commentId,
        editingCommentContent: action.content,
      };
    case "cancelEditingComment":
      return { ...state, editingCommentId: null, editingCommentContent: "" };
    case "deleteIssueDialogOpened":
      return { ...state, isDeleteIssueDialogOpen: true };
    case "deleteIssueDialogClosed":
      return { ...state, isDeleteIssueDialogOpen: false };
    default:
      return state;
  }
}

type IssueDescriptionSectionProps = {
  value: string;
  onChange: (next: string) => void;
};

function IssueDescriptionSection({
  value,
  onChange,
}: IssueDescriptionSectionProps) {
  const tDashboard = useTranslations("dashboard");

  return (
    <div>
      <h3 id="issue-description-label" className="font-medium mb-2">
        {tDashboard("issue.detail.descriptionLabel")}
      </h3>
      <textarea
        aria-labelledby="issue-description-label"
        className="w-full min-h-35 rounded-md border bg-muted/30 p-4 text-sm text-foreground/80 leading-relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder={tDashboard("issue.detail.descriptionPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type IssueCommentItemProps = {
  comment: Comment;
  memberById: Map<string, UserProfile>;
  currentUser: UserProfile | undefined;
  formatDate: (value: string | number | Date) => string;
  isDeleting: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  editingValue: string;
  onStartEditing: (commentId: string, content: string) => void;
  onCancelEditing: () => void;
  onEditingValueChange: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, content: string) => void;
};

function IssueCommentItem({
  comment,
  memberById,
  currentUser,
  formatDate,
  isDeleting,
  isUpdating,
  isEditing,
  editingValue,
  onStartEditing,
  onCancelEditing,
  onEditingValueChange,
  onDelete,
  onUpdate,
}: IssueCommentItemProps) {
  const tDashboard = useTranslations("dashboard");

  const member = memberById.get(comment.userId);
  const isOwnComment = comment.userId === currentUser?.id;
  const commenterName =
    comment.userId === currentUser?.id
      ? tDashboard("issue.assignee.me", {
          name: currentUser?.name ?? "",
        })
      : (member?.name ?? comment.userId);

  return (
    <div
      key={comment.id}
      className="flex gap-3 rounded-lg border p-3 bg-muted/20"
    >
      <Avatar className="size-8">
        <AvatarImage src={member?.image} />
        <AvatarFallback>{commenterName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{commenterName}</p>
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">
              {isDeleting
                ? tDashboard("issue.detail.commentDeleting")
                : isUpdating
                  ? tDashboard("issue.detail.commentUpdating")
                  : formatDate(comment.createdAt)}
            </p>
            {isOwnComment && !isEditing ? (
              <DropdownMenuUD
                onEdit={() => onStartEditing(comment.id, comment.content)}
                onDelete={() => onDelete(comment.id)}
              />
            ) : null}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              aria-label={`Edit comment by ${commenterName}`}
              className="w-full min-h-20 rounded-md border bg-muted/30 p-3 text-sm text-foreground/80 leading-relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={editingValue}
              onChange={(e) => onEditingValueChange(comment.id, e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancelEditing}
              >
                {tDashboard("issue.detail.commentCancel")}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!editingValue.trim() || isUpdating}
                onClick={() => onUpdate(comment.id, editingValue.trim())}
              >
                {isUpdating
                  ? tDashboard("issue.detail.commentUpdating")
                  : tDashboard("issue.detail.commentUpdate")}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/90 whitespace-pre-wrap wrap-break-word">
            {comment.content}
          </p>
        )}

        {isOwnComment && isEditing ? (
          <div className="flex justify-end">
            <span className="text-[11px] text-muted-foreground">
              {tDashboard("issue.detail.commentEditing")}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type IssueCommentsSectionProps = {
  comments: Comment[];
  currentUser: UserProfile | undefined;
  memberById: Map<string, UserProfile>;
  formatDate: (value: string | number | Date) => string;
  newComment: string;
  commentState: {
    canSubmit: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    deletingCommentId: string | null;
    isUpdating: boolean;
    updatingCommentId: string | null;
  };
  editingCommentId: string | null;
  editingCommentContent: string;
  onNewCommentChange: (next: string) => void;
  onSubmit: () => void;
  onStartEditing: (commentId: string, content: string) => void;
  onCancelEditing: () => void;
  onEditingValueChange: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, content: string) => void;
};

function IssueCommentsSection({
  comments,
  currentUser,
  memberById,
  formatDate,
  newComment,
  commentState,
  editingCommentId,
  editingCommentContent,
  onNewCommentChange,
  onSubmit,
  onStartEditing,
  onCancelEditing,
  onEditingValueChange,
  onDelete,
  onUpdate,
}: IssueCommentsSectionProps) {
  const tDashboard = useTranslations("dashboard");

  return (
    <div className="space-y-4">
      <h3 id="issue-comments-label" className="font-medium">
        {tDashboard("issue.detail.commentsLabel")}
      </h3>

      <div className="flex gap-3">
        <Avatar className="size-8">
          <AvatarImage src={currentUser?.image} />
          <AvatarFallback>
            {(currentUser?.name ?? "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <textarea
            aria-labelledby="issue-comments-label"
            className="w-full min-h-20 rounded-md border bg-muted/30 p-3 text-sm text-foreground/80 leading-relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder={tDashboard("issue.detail.commentPlaceholder")}
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />

          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={!commentState.canSubmit}
              onClick={onSubmit}
            >
              {commentState.isCreating
                ? tDashboard("issue.detail.commentSubmitting")
                : tDashboard("issue.detail.commentSubmit")}
            </Button>
          </div>
        </div>
      </div>

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <IssueCommentItem
              key={comment.id}
              comment={comment}
              memberById={memberById}
              currentUser={currentUser}
              formatDate={formatDate}
              isDeleting={
                commentState.isDeleting &&
                commentState.deletingCommentId === comment.id
              }
              isUpdating={
                commentState.isUpdating &&
                commentState.updatingCommentId === comment.id
              }
              isEditing={editingCommentId === comment.id}
              editingValue={editingCommentContent}
              onStartEditing={onStartEditing}
              onCancelEditing={onCancelEditing}
              onEditingValueChange={onEditingValueChange}
              onDelete={onDelete}
              onUpdate={(commentId, content) => {
                onUpdate(commentId, content);
                onCancelEditing();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-8 border-dashed border-2 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {tDashboard("issue.detail.noComments")}
          </p>
        </div>
      )}
    </div>
  );
}

type IssueSidebarSectionProps = {
  statusName: string;
  assigneeOptions: Array<{ value: string; label: string }>;
  assigneeId: string;
  onAssigneeChange: (value: string) => void;
  priority: PriorityType;
  priorityOptions: ReadonlyArray<{ value: PriorityType; label: string }>;
  priorityLabel: string;
  onPriorityChange: (value: PriorityType) => void;
  isDirty: boolean;
  isUpdating: boolean;
  isDeletingIssue: boolean;
  onSave: () => void;
  onDeleteClick: () => void;
  deleteModal: React.ReactNode;
  reporterName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  formatDate: (value: string | number | Date) => string;
};

function IssueSidebarSection({
  statusName,
  assigneeOptions,
  assigneeId,
  onAssigneeChange,
  priority,
  priorityOptions,
  priorityLabel,
  onPriorityChange,
  isDirty,
  isUpdating,
  isDeletingIssue,
  onSave,
  onDeleteClick,
  deleteModal,
  reporterName,
  createdAt,
  updatedAt,
  formatDate,
}: IssueSidebarSectionProps) {
  const tDashboard = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {tDashboard("issue.detail.statusLabel")}
          </span>
          <div>
            <Badge variant="secondary">{statusName}</Badge>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {tDashboard("issue.form.assigneeLabel")}
          </span>
          <div className="space-y-2">
            <Select value={assigneeId} onValueChange={onAssigneeChange}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={tDashboard("issue.form.assigneePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="size-6">
                <AvatarImage src="" />
                <AvatarFallback>
                  <User2 className="size-3" />
                </AvatarFallback>
              </Avatar>
              <span>
                {assigneeOptions.find((option) => option.value === assigneeId)
                  ?.label || tDashboard("issue.assignee.unassigned")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {tDashboard("issue.form.priorityLabel")}
          </span>
          <div className="space-y-2">
            <Select
              value={priority}
              onValueChange={(value) => onPriorityChange(value as PriorityType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={tDashboard("issue.form.priorityPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Flag
                className={cn(
                  "size-4",
                  priority === "HIGH"
                    ? "text-red-500"
                    : priority === "MEDIUM"
                      ? "text-yellow-500"
                      : "text-green-500",
                )}
              />
              <span className="text-sm">{priorityLabel}</span>
            </div>
          </div>
        </div>

        <Separator />

        <Button
          className="w-full"
          onClick={onSave}
          disabled={!isDirty || isUpdating}
        >
          {isUpdating
            ? tDashboard("issue.update.submitting")
            : tDashboard("issue.detail.saveChanges")}
        </Button>

        <Button
          className="w-full"
          variant="destructive"
          onClick={onDeleteClick}
          disabled={isDeletingIssue}
        >
          {isDeletingIssue
            ? tDashboard("issue.detail.deletingIssue")
            : tDashboard("issue.detail.deleteIssue")}
        </Button>

        {deleteModal}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {tDashboard("issue.detail.reporterLabel")}
            </span>
            <span className="font-medium text-xs truncate max-w-30">
              {reporterName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {tDashboard("issue.detail.createdAtLabel")}
            </span>
            <span className="text-xs">{formatDate(createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {tDashboard("issue.detail.updatedAtLabel")}
            </span>
            <span className="text-xs">{formatDate(updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IssueDetailEditableContent({
  issue,
  assigneeOptions,
  reporterName,
  statusName,
  currentUser,
  comments,
  memberById,
  mutationState,
  onSave,
  onDeleteIssue,
  onUpdateComment,
  onDeleteComment,
  onCreateComment,
}: IssueDetailEditableContentProps) {
  const locale = useLocale();
  const [state, dispatch] = useReducer(
    issueDetailEditableReducer,
    issue,
    createIssueDetailEditableState,
  );

  const formatDate = useMemo(
    () =>
      createDateFormatter(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  const tDashboard = useTranslations("dashboard");
  const priorityOptions = [
    { value: Priority.LOW, label: tDashboard("issue.priority.low") },
    { value: Priority.MEDIUM, label: tDashboard("issue.priority.medium") },
    { value: Priority.HIGH, label: tDashboard("issue.priority.high") },
  ] as const;

  const priorityLabel =
    priorityOptions.find((option) => option.value === state.priority)?.label ??
    state.priority;

  const {
    isUpdating,
    isCreatingComment,
    isDeletingComment,
    deletingCommentId,
    isUpdatingComment,
    updatingCommentId,
    isDeletingIssue,
  } = mutationState;

  const normalizedAssigneeId =
    state.assigneeId === "UNASSIGNED" ? null : state.assigneeId;

  const canSubmitComment =
    !!state.newComment.trim() && !!currentUser?.id && !isCreatingComment;

  const submitComment = () => {
    if (!canSubmitComment) return;
    onCreateComment(state.newComment.trim());
    dispatch({ type: "newCommentChanged", value: "" });
  };

  const isDirty =
    state.description !== (issue.description ?? "") ||
    normalizedAssigneeId !== (issue.assigneeId ?? null) ||
    state.priority !== issue.priority;

  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8 py-4">
      <ScrollArea className="min-h-0 pr-4">
        <div className="space-y-8 pb-1">
          <IssueDescriptionSection
            value={state.description}
            onChange={(next) =>
              dispatch({ type: "descriptionChanged", value: next })
            }
          />

          <Separator />

          <IssueCommentsSection
            comments={comments}
            currentUser={currentUser}
            memberById={memberById}
            formatDate={formatDate}
            newComment={state.newComment}
            commentState={{
              canSubmit: canSubmitComment,
              isCreating: isCreatingComment,
              isDeleting: isDeletingComment,
              deletingCommentId,
              isUpdating: isUpdatingComment,
              updatingCommentId,
            }}
            editingCommentId={state.editingCommentId}
            editingCommentContent={state.editingCommentContent}
            onNewCommentChange={(next) =>
              dispatch({ type: "newCommentChanged", value: next })
            }
            onSubmit={submitComment}
            onStartEditing={(commentId, content) =>
              dispatch({ type: "startEditingComment", commentId, content })
            }
            onCancelEditing={() => dispatch({ type: "cancelEditingComment" })}
            onEditingValueChange={(commentId, content) =>
              dispatch({ type: "startEditingComment", commentId, content })
            }
            onDelete={onDeleteComment}
            onUpdate={onUpdateComment}
          />
        </div>
      </ScrollArea>

      <IssueSidebarSection
        statusName={statusName}
        assigneeOptions={assigneeOptions}
        assigneeId={state.assigneeId}
        onAssigneeChange={(value) =>
          dispatch({ type: "assigneeChanged", value })
        }
        priority={state.priority}
        priorityOptions={priorityOptions}
        priorityLabel={priorityLabel}
        onPriorityChange={(value) =>
          dispatch({ type: "priorityChanged", value })
        }
        isDirty={isDirty}
        isUpdating={isUpdating}
        isDeletingIssue={isDeletingIssue}
        onSave={() =>
          onSave({
            description: state.description,
            assigneeId: normalizedAssigneeId,
            priority: state.priority,
          })
        }
        onDeleteClick={() => dispatch({ type: "deleteIssueDialogOpened" })}
        deleteModal={
          <DeleteConfirmModal
            isOpen={state.isDeleteIssueDialogOpen}
            isLoading={isDeletingIssue}
            title={tDashboard("issue.delete.title", { title: issue.title })}
            description={tDashboard("issue.delete.description")}
            onClose={(open) =>
              dispatch({
                type: open
                  ? "deleteIssueDialogOpened"
                  : "deleteIssueDialogClosed",
              })
            }
            onConfirm={() => {
              onDeleteIssue();
              dispatch({ type: "deleteIssueDialogClosed" });
            }}
          />
        }
        reporterName={reporterName}
        createdAt={issue.createdAt}
        updatedAt={issue.updatedAt}
        formatDate={formatDate}
      />
    </div>
  );
}

function IssueDetailSkeleton() {
  return (
    <>
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-3/4" />
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8 py-4">
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Separator />
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border p-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between gap-2">
                      <Skeleton className="h-4 w-30" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
          <Separator />
          <Skeleton className="h-9 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </>
  );
}
