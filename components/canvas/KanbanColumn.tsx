'use client'
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import KanbanCard from "./KanbanCard";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import { cn } from "@/lib/utils";

type ColumnProps = {
    id: string
    title: string
    columnId: string
    tasks: Task[]
    actionCreateTask: (columnId: string) => void
    actionDeleteColumn: (columnId: string) => void
    actionEditColumn: (columnId: string) => void
}

type Task = {
    id: string;
    title: string;
    priority?: 'low' | 'medium' | 'high';
    storyPoint?: number;
    description?: string;
}

export default function KanbanColumn(props: ColumnProps) {
    const { ref: dropRef, isDropTarget } = useDroppable({
        id: props.id,
        data: { type: 'column' }
    });

    const { ref: dragRef, isDragging } = useDraggable({
        id: props.id,
        data: { type: 'column' }
    });
    return (
        <div ref={dropRef} className={cn("min-w-52 flex flex-col flex-1 bg-muted/50 rounded-lg duration-200", isDropTarget ? "bg-muted/80 ring-2 ring-primary/50" : "bg-muted/50", isDragging && "opacity-50 border-dashed border-2 border-primary")}>
            {/* Header */}
            <div ref={dragRef} className="flex items-center justify-between p-3">
                <h3 className="text-lg font-medium">{props.title}</h3>
                <div className="flex gap-2">
                    <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => props.actionEditColumn(props.columnId)}>
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => props.actionDeleteColumn(props.columnId)}>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            {/* Task List */}
            <ScrollArea className="flex-1 min-h-0 px-3">
                <div>
                    {props.tasks.map((task) => (
                        <KanbanCard
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            priority={task.priority}
                            storyPoint={task.storyPoint}
                            description={task.description}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div >
    )
}