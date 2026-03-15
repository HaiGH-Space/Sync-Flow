import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type DeleteConfirmModalProps = {
    isOpen: boolean;
    isLoading?: boolean;
    title: string
    description?: string
    onConfirm: () => void
    onClose: (isOpen: boolean) => void;
}

export default function DeleteConfirmModal({
    isOpen,
    isLoading,
    title,
    description,
    onConfirm,
    onClose
}: DeleteConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Confirm"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}