'use client'
import { useState } from "react";
import KanbanColumn, { TaskProps } from "./KanbanColumn"
import { DragDropProvider } from "@dnd-kit/react";
import { Priority } from "@/lib/services/issue";

const INITIAL_TASKS: TaskProps[] = [
    { id: "task-1", columnId: "todo", title: "Khởi tạo dnd-kit mới", priority: Priority.HIGH, description: "Tạo một board Kanban đơn giản sử dụng dnd-kit để quản lý trạng thái của các task."},
    { id: "task-2", columnId: "todo", title: "Chỉnh style cột", priority: Priority.MEDIUM, description: "Chỉnh sửa style của cột để cải thiện trải nghiệm người dùng."},
    { id: "task-3", columnId: "in-progress", title: "Kéo thả Kanban", priority: Priority.HIGH, description: "Cho phép kéo thả task giữa các cột và sắp xếp lại thứ tự trong cùng một cột."},
];

const INITIAL_COLUMNS = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" }
];

export default function BoardCanvas() {
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [columns, setColumns] = useState(INITIAL_COLUMNS);
    return <div className="w-full h-full">
        <DragDropProvider onDragEnd={(event) => {
            const { operation, canceled } = event;

            if (canceled) return;

            const { source, target } = operation;

            if (!target) return;
            if (!source || !target) return;
            const sourceType = source.data?.type || 'task';
            const targetType = target.data?.type || 'column';
            if (sourceType === 'column' && targetType === 'column') {
                setColumns((prevCols) => {
                    const sourceIndex = prevCols.findIndex(c => c.id === source.id);
                    const targetIndex = prevCols.findIndex(c => c.id === target.id);
                    
                    if (sourceIndex === targetIndex) return prevCols;

                    const newCols = [...prevCols];
                    const [movedColumn] = newCols.splice(sourceIndex, 1);
                    newCols.splice(targetIndex, 0, movedColumn);
                    return newCols;
                });
                return;
            }

            if (sourceType === 'task') {
                const targetColumnId = targetType === 'column' ? target.id : target.data?.columnId;
                if(!targetColumnId) return;
                setTasks((prevTasks) =>
                    prevTasks.map((task) => {
                        if (task.id === source.id) {
                            return { ...task, columnId: targetColumnId as string };
                        }
                        return task;
                    })
                )
            }
        }}>
            <div className="flex flex-row gap-4 w-full h-full">
                {columns.map((col) => (
                        <KanbanColumn 
                            key={col.id}
                            id={col.id} 
                            columnId={col.id} 
                            title={col.title} 
                            tasks={tasks.filter(t => t.columnId === col.id)}
                            actionDeleteColumn={() => { }} 
                            actionEditColumn={() => { }} 
                        />
                    ))}
            </div>
        </DragDropProvider>
    </div>
}
