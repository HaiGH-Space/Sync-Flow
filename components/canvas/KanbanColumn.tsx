import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import KanbanCard from "./KanbanCard";

type ColumnProps = {
    title: string
    columnId: string
    actionCreateTask: (columnId: string) => void
    actionDeleteColumn: (columnId: string) => void
    actionEditColumn: (columnId: string) => void
}

export default function KanbanColumn(props: ColumnProps) {
    return (
        <div className="min-w-52 flex flex-col flex-1 bg-muted/50 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
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
                    {Array.from({ length: 10 }).map((_, index) => (
                       <KanbanCard key={index} title={`Task ${index + 1}`} priority={index % 3 === 0 ? "high" : index % 3 === 1 ? "medium" : "low"} storyPoint={3} description="This is a task description." />
                    ))}
                </div>
            </ScrollArea>
        </div >
    )
}