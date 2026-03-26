'use client'
import { useCallback } from "react"
import { DragDropProvider } from "@dnd-kit/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnsQueryOptions } from "@/queries/column";
import { useTranslations } from "next-intl";
import { useBoardDragHandlers } from "./useBoardDragHandlers";
import KanbanColumn from "./KanbanColumn";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleAlert, Inbox, Loader2 } from "lucide-react";


interface BoardCanvasProps {
    projectId: string
}
export default function BoardCanvas({ projectId }: BoardCanvasProps) {
    const tDashboard = useTranslations('dashboard');
    const tCommon = useTranslations('common');
    const { onDragStart, onDragEnd } = useBoardDragHandlers({ projectId });

    const {
        data: columns,
        error: errorColumns,
        isLoading: isLoadingColumns,
        refetch: refetchColumns,
        isRefetching,
    } = useQuery(createColumnsQueryOptions({ projectId }));

    // Stable noop callbacks so memoized columns are not forced to re-render.
    const handleDeleteColumn = useCallback(() => { }, []);
    const handleEditColumn = useCallback(() => { }, []);

    if (isLoadingColumns) {
        return (
            <div className="w-full h-full flex flex-row gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={`board-column-skeleton-${index}`} className="min-w-52 flex-1 bg-muted/40 rounded-lg p-3 space-y-3">
                    </Skeleton>
                ))}
            </div>
        );
    }

    if (errorColumns) {
        return (
            <div className="w-full h-full flex items-center justify-center px-4">
                <div className="max-w-lg w-full text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <CircleAlert className="size-6" />
                    </div>
                    <p className="text-base font-semibold text-foreground">{tDashboard('board.errorLoadingColumns')}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tDashboard('board.errorHint')}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchColumns()}
                        disabled={isRefetching}
                        className="mt-4 cursor-pointer min-w-30"
                    >
                        {isRefetching ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="size-3.5 animate-spin" />
                                {tCommon('status.loading')}
                            </span>
                        ) : (
                            tCommon('actions.retry')
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <DragDropProvider
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="flex flex-row gap-4 w-full h-full">
                    {(columns?.data && columns.data.length > 0) ? (
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
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="max-w-lg w-full text-center px-4">
                                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                    <Inbox className="size-6" />
                                </div>
                                <p className="text-sm text-muted-foreground">{tDashboard('board.empty')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </DragDropProvider>
        </div>
    );
}
