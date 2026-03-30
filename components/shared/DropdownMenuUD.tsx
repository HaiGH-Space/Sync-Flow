'use client'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit2, MoreHorizontal, Trash2, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

type DropdownMenuUDProps = {
    onEdit?: () => void
    onDelete?: () => void
    showEdit?: boolean
    showDelete?: boolean
    editLabel?: string
    deleteLabel?: string
    triggerClassName?: string
    contentClassName?: string
    triggerIcon?: LucideIcon
}

export default function DropdownMenuUD({
    onEdit,
    onDelete,
    showEdit = true,
    showDelete = true,
    editLabel,
    deleteLabel,
    triggerClassName,
    contentClassName,
    triggerIcon: TriggerIcon = MoreHorizontal,
}: DropdownMenuUDProps) {
    const t = useTranslations('common')

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("cursor-pointer", triggerClassName)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <TriggerIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={contentClassName}>
                {showEdit && onEdit && (
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.();
                        }}
                    >
                        <Edit2 className="w-4 h-4" />
                        {editLabel ?? t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {showDelete && onDelete && (
                    <DropdownMenuItem
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                        {deleteLabel ?? t('actions.delete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}