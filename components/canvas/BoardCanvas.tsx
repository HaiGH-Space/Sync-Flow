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


interface BoardCanvasProps {
    projectId: string
}

export default function BoardCanvas({ projectId }: BoardCanvasProps) {

    const queryClient = useQueryClient();

    // ── Refs — only accessed in event handlers, never during render ───────
    const isDraggingRef = useRef(false);
    const issueDebounceMap = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    const columnDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Server state (TanStack Query cache is the single source of truth) ─
    const { data: columns, error: errorColumns, isLoading: isLoadingColumns } = useQuery({
        queryKey: ['columns', projectId],
        queryFn: () => columnService.getColumns({ projectId }),
        staleTime: 1000 * 60 * 5,
    });

    const { data: issues, error: errorIssues, isLoading: isLoadingIssues } = useQuery({
        queryKey: ['issues', projectId],
        queryFn: () => issueService.getIssuesByProjectId(projectId),
        staleTime: 1000 * 60 * 5,
    });

    // ── Mutations: cancel in-flight queries, per-item success update,
    //    per-item rollback on error (only reverts the failed item) ──────────
    const updateColumnMutation = useMutation({
        mutationFn: ({ id, order }: { id: string; order: number; originalOrder: number }) =>
            columnService.updateColumn({ projectId, columnData: { id, order } }),
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
            queryClient.setQueryData<ApiResponse<Column[]>>(['columns', projectId], (old) => {
                if (!old) return old;
                const restored = old.data.map(c => c.id === vars.id ? { ...c, order: vars.originalOrder } : c);
                return { ...old, data: restored.sort((a, b) => a.order - b.order) };
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
    const handleDeleteColumn = useCallback(() => {}, []);
    const handleEditColumn = useCallback(() => {}, []);

    if (isLoadingColumns || isLoadingIssues) return <div>Loading...</div>;
    if (errorColumns) return <div>Error loading columns</div>;
    if (errorIssues) return <div>Error loading issues</div>;

    return (
        <div className="w-full h-full">
            <DragDropProvider
                onDragStart={() => {
                    isDraggingRef.current = true;
                    // Cancel all pending debounce timers from previous fast drops
                    // so their onSuccess cache writes don't fire mid-drag and
                    // cause layout jerks on the currently active drag.
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

                        const sourceIndex = currentCols.data.findIndex(c => c.id === source.id);
                        const targetIndex = currentCols.data.findIndex(c => c.id === target.id);
                        if (sourceIndex === targetIndex) return;

                        const originalOrder = currentCols.data[sourceIndex].order;

                        // Instant optimistic reorder straight into the cache
                        const next = [...currentCols.data];
                        const [moved] = next.splice(sourceIndex, 1);
                        next.splice(targetIndex, 0, moved);
                        queryClient.setQueryData<ApiResponse<Column[]>>(['columns', projectId], {
                            ...currentCols,
                            data: next.map((col, i) => ({ ...col, order: i })),
                        });

                        // Debounce: collapse rapid reorders into a single API call
                        if (columnDebounceRef.current) clearTimeout(columnDebounceRef.current);
                        columnDebounceRef.current = setTimeout(() => {
                            updateColumnMutation.mutate({ id: source.id as string, order: targetIndex, originalOrder });
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
                                key={col.id}
                                id={col.id}
                                columnId={col.id}
                                name={col.name}
                                actionDeleteColumn={handleDeleteColumn}
                                actionEditColumn={handleEditColumn}
                            />
                        ))
                    ) : (
                        <div>No columns or issues found</div>
                    )}
                </div>
            </DragDropProvider>
        </div>
    );
}
