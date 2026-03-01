import KanbanColumn from "./KanbanColumn"

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
