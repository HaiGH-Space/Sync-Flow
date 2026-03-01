import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"

type KanbanCardProps = {
    title: string
    description?: string
    storyPoint?: number
    priority?: 'low' | 'medium' | 'high'
}

export default function KanbanCard(props: KanbanCardProps) {
    return (
        <div className="duration-200 hover:border-primary cursor-grab w-full min-w-48 p-3 mb-2 flex flex-col bg-card border rounded-lg">
            <div className="flex justify-between">
                <h4 className="font-medium">{props.title}</h4>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>
            {props.description && <p className="text-sm text-muted-foreground">{props.description}</p>}
            <div className="flex justify-between mt-2">
                {props.storyPoint && <span className="text-sm text-muted-foreground">SP: {props.storyPoint}</span>}
                {props.priority && <span className={`text-sm ${props.priority === 'high' ? 'text-red-500' : props.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>Priority: {props.priority}</span>}
            </div>
        </div>
    )
}