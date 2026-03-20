'use client'
import { useCallback } from "react"
import KanbanColumn from "./KanbanColumn"
import { DragDropProvider } from "@dnd-kit/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnsQueryOptions } from "@/queries/column";
import { useTranslations } from "next-intl";
import { useBoardDragHandlers } from "./useBoardDragHandlers";


interface BoardCanvasProps {
    projectId: string
}
export default function BoardCanvas({ projectId }: BoardCanvasProps) {
    const tDashboard = useTranslations('dashboard');
    const tCommon = useTranslations('common');
    const { onDragStart, onDragEnd } = useBoardDragHandlers({ projectId });

    const { data: columns, error: errorColumns, isLoading: isLoadingColumns } = useQuery(createColumnsQueryOptions({ projectId }));

    // Stable noop callbacks so memoized columns are not forced to re-render.
    const handleDeleteColumn = useCallback(() => { }, []);
    const handleEditColumn = useCallback(() => { }, []);

    if (isLoadingColumns) return <div>{tCommon('status.loading')}</div>;
    if (errorColumns) return <div>{tDashboard('board.errorLoadingColumns')}</div>;

    return (
        <div className="w-full h-full">
            <DragDropProvider
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
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
