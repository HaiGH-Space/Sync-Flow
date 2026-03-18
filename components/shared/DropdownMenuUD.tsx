import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
type DropdownMenuUDProps = {
    onEdit?: () => void
    onDelete?: () => void
}

export default function DropdownMenuUD({ onEdit, onDelete }: DropdownMenuUDProps) {
    const t = useTranslations('common')
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            < DropdownMenuContent >
                <DropdownMenuItem className="cursor-pointer" onClick={onEdit}>
                    <Edit2 className="w-4 h-4" />
                    {t('actions.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                    {t('actions.delete')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}