import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import React from "react"

export default function BoardCanvas() {
    return <div className="w-full h-full">
        <div className="flex flex-row gap-4 w-full h-full">
            <KanbanColumn title="To Do" columnId="todo" actionCreateTask={() => { }} actionDeleteColumn={() => { }} actionEditColumn={() => { }} />
            <KanbanColumn title="In Progress" columnId="in-progress" actionCreateTask={() => { }} actionDeleteColumn={() => { }} actionEditColumn={() => { }} />
            <KanbanColumn title="Review" columnId="review" actionCreateTask={() => { }} actionDeleteColumn={() => { }} actionEditColumn={() => { }} />
            <KanbanColumn title="Done" columnId="done" actionCreateTask={() => { }} actionDeleteColumn={() => { }} actionEditColumn={() => { }} />
        </div>
    </div>
}

type ColumnProps = {
    title: string
    columnId: string
    actionCreateTask: (columnId: string) => void
    actionDeleteColumn: (columnId: string) => void
    actionEditColumn: (columnId: string) => void
}

function KanbanColumn(props: ColumnProps) {
    return (
        <div className="min-w-52 flex flex-col flex-1 bg-muted/50 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <h3 className="text-lg font-medium">{props.title}</h3>
                <div className="flex gap-2">
                    <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => props.actionEditColumn(props.columnId)}>
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button className="cursor-pointer" variant="ghost" size="icon" >
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            {/* Task List */}
            <ScrollArea className="flex-1 min-h-0 px-3">
                <div>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <React.Fragment key={index}>
                            <div className="p-4">
                                <h4 className="font-medium">Task Title</h4>
                                <p className="text-sm text-muted-foreground">Task description goes here...</p>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </ScrollArea>
        </div >
    )
}