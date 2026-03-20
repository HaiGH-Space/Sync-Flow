'use client'
import { useCallback, useRef } from "react"
import KanbanColumn from "./KanbanColumn"
import { DragDropProvider } from "@dnd-kit/react";
import { issueService } from "@/lib/api/issue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { columnService } from "@/lib/api/column";
import type { ApiResponse } from "@/lib/api/api";
import type { Column } from "@/lib/api/column";
import type { Issue } from "@/lib/api/issue";
import { createColumnsQueryOptions } from "@/queries/column";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getInsertOrder, rebalanceOrders } from "@/lib/ordering";


interface BoardCanvasProps {
    projectId: string
}
export default function BoardCanvas({ projectId }: BoardCanvasProps) {
    const tDashboard = useTranslations('dashboard');
    const tCommon = useTranslations('common');

    const queryClient = useQueryClient();

    // ── Refs — only accessed in event handlers, never during render ───────
    const isDraggingRef = useRef(false);
    const issueDebounceMap = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    const columnDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: columns, error: errorColumns, isLoading: isLoadingColumns } = useQuery(createColumnsQueryOptions({ projectId }));

    // ── Mutations: cancel in-flight queries, per-item success update,
    //    per-item rollback on error (only reverts the failed item) ──────────
    const updateColumnMutation = useMutation({
        mutationFn: ({ id, order }: { id: string; order: number; originalOrder: number }) =>
            columnService.updateColumn({ projectId, columnId: id, columnData: { order } }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['columns', projectId] });
        },
        onSuccess: (updatedColumn) => {
            queryClient.setQueryData<ApiResponse<Column[]>>(['columns', projectId], (old) => {
                if (!old) return old;
                return { ...old, data: old.data.map(c => c.id === updatedColumn.data.id ? updatedColumn.data : c) };
            });
        },
        onError: (_err, vars) => {
            toast.error('Failed to reorder columns. Please try again.');
            queryClient.setQueryData<ApiResponse<Column[]>>(['columns', projectId], (old) => {
                if (!old) return old;
                const restored = old.data.map(c => c.id === vars.id ? { ...c, order: vars.originalOrder } : c);
                return { ...old, data: restored.sort((a, b) => a.order - b.order) };
            });
        },
    });

    const rebalanceColumnsMutation = useMutation({
        mutationFn: async ({ updates }: { updates: Array<{ id: string; order: number }>; previousColumns: Column[] }) => {
            for (const update of updates) {
                await columnService.updateColumn({
                    projectId,
                    columnId: update.id,
                    columnData: { order: update.order },
                });
            }
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['columns', projectId] });
        },
        onError: (_err, vars) => {
            toast.error('Failed to reorder columns. Please try again.');
            queryClient.setQueryData<ApiResponse<Column[]>>(['columns', projectId], (old) => {
                if (!old) return old;
                return { ...old, data: [...vars.previousColumns].sort((a, b) => a.order - b.order) };
            });
        },
    });

    const updateIssueMutation = useMutation({
        mutationFn: ({ issueId, columnId }: { issueId: string; columnId: string; originalColumnId: string }) =>
            issueService.updateIssue({ projectId, issueId, issueData: { columnId } }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['issues', projectId] });
        },
        onSuccess: (updatedIssue) => {
            queryClient.setQueryData<ApiResponse<Issue[]>>(['issues', projectId], (old) => {
                if (!old) return old;
                return { ...old, data: old.data.map(i => i.id === updatedIssue.data.id ? updatedIssue.data : i) };
            });
        },
        onError: (_err, vars) => {
            queryClient.setQueryData<ApiResponse<Issue[]>>(['issues', projectId], (old) => {
                if (!old) return old;
                return { ...old, data: old.data.map(i => i.id === vars.issueId ? { ...i, columnId: vars.originalColumnId } : i) };
            });
        },
    });

    // ── Stable callbacks so memo'd KanbanColumn doesn't re-render ─────────
    const handleDeleteColumn = useCallback(() => { }, []);
    const handleEditColumn = useCallback(() => { }, []);

    if (isLoadingColumns) return <div>{tCommon('status.loading')}</div>;
    if (errorColumns) return <div>{tDashboard('board.errorLoadingColumns')}</div>;

    return (
        <div className="w-full h-full">
            <DragDropProvider
                onDragStart={() => {
                    isDraggingRef.current = true;
                    if (columnDebounceRef.current) {
                        clearTimeout(columnDebounceRef.current);
                        columnDebounceRef.current = null;
                    }
                    issueDebounceMap.current.forEach((timer) => clearTimeout(timer));
                    issueDebounceMap.current.clear();
                    // Also cancel any in-flight network requests for the same reason.
                    queryClient.cancelQueries({ queryKey: ['issues', projectId] });
                    queryClient.cancelQueries({ queryKey: ['columns', projectId] });
                }}
                onDragEnd={(event) => {
                    isDraggingRef.current = false;

                    const { operation, canceled } = event;
                    if (canceled) return;

                    const { source, target } = operation;
                    if (!source || !target) return;

                    const sourceType = source.data?.type || 'task';
                    const targetType = target.data?.type || 'column';

                    if (sourceType === 'column' && targetType === 'column') {
                        const currentCols = queryClient.getQueryData<ApiResponse<Column[]>>(['columns', projectId]);
                        if (!currentCols) return;

                        const sortedColumns = [...currentCols.data].sort((a, b) => a.order - b.order);
                        const sourceIndex = sortedColumns.findIndex(c => c.id === source.id);
                        const targetIndex = sortedColumns.findIndex(c => c.id === target.id);
                        if (sourceIndex === targetIndex) return;

                        const originalOrder = sortedColumns[sourceIndex].order;

                        // Instant optimistic reorder straight into the cache
                        const next = [...sortedColumns];
                        const [moved] = next.splice(sourceIndex, 1);
                        next.splice(targetIndex, 0, moved);

                        const prevCol = next[targetIndex - 1];
                        const nextCol = next[targetIndex + 1];
                        const { order: newOrder, requiresRebalance } = getInsertOrder(prevCol?.order, nextCol?.order);

                        const optimisticColumns = requiresRebalance
                            ? rebalanceOrders(next)
                            : next.map((col) => col.id === moved.id ? { ...col, order: newOrder } : col);

                        queryClient.setQueryData<ApiResponse<Column[]>>(['columns', projectId], {
                            ...currentCols,
                            data: optimisticColumns,
                        });

                        // Debounce: collapse rapid reorders into a single API call
                        if (columnDebounceRef.current) clearTimeout(columnDebounceRef.current);
                        columnDebounceRef.current = setTimeout(() => {
                            if (requiresRebalance) {
                                const oldOrderMap = new Map(currentCols.data.map((col) => [col.id, col.order]));
                                const updates = optimisticColumns
                                    .filter((col) => oldOrderMap.get(col.id) !== col.order)
                                    .map((col) => ({ id: col.id, order: col.order }));

                                if (updates.length === 0) return;

                                rebalanceColumnsMutation.mutate({
                                    updates,
                                    previousColumns: currentCols.data,
                                });
                                return;
                            }
                            updateColumnMutation.mutate({ id: source.id as string, order: newOrder, originalOrder });
                        }, 300);
                        return;
                    }

                    if (sourceType === 'task') {
                        const targetColumnId = targetType === 'column' ? target.id : target.data?.columnId;
                        if (!targetColumnId) return;

                        const currentIssues = queryClient.getQueryData<ApiResponse<Issue[]>>(['issues', projectId]);
                        if (!currentIssues) return;

                        const originalColumnId = currentIssues.data.find(i => i.id === source.id)?.columnId ?? '';

                        // Instant optimistic card move straight into the cache
                        queryClient.setQueryData<ApiResponse<Issue[]>>(['issues', projectId], {
                            ...currentIssues,
                            data: currentIssues.data.map((issue) =>
                                issue.id === source.id
                                    ? { ...issue, columnId: targetColumnId as string }
                                    : issue
                            ),
                        });

                        // Per-issue debounce: each issue has its own independent timer
                        const issueId = source.id as string;
                        const existing = issueDebounceMap.current.get(issueId);
                        if (existing) clearTimeout(existing);
                        issueDebounceMap.current.set(
                            issueId,
                            setTimeout(() => {
                                issueDebounceMap.current.delete(issueId);
                                updateIssueMutation.mutate({ issueId, columnId: targetColumnId as string, originalColumnId });
                            }, 300)
                        );
                    }
                }}
            >
                <div className="flex flex-row gap-4 w-full h-full">
                    {columns?.data && columns.data.length > 0 ? (
                        columns.data.map((col) => (
                            <KanbanColumn
                                projectId={projectId}
                                key={col.id}
                                id={col.id}
                                columnId={col.id}
                                name={col.name}
                                actionDeleteColumn={handleDeleteColumn}
                                actionEditColumn={handleEditColumn}
                            />
                        ))
                    ) : (
                        <div>{tDashboard('board.empty')}</div>
                    )}
                </div>
            </DragDropProvider>
        </div>
    );
}
