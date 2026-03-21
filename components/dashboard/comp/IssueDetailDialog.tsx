'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createIssueQueryOptions } from "@/queries/issue";
import { useQuery } from "@tanstack/react-query";

interface IssueDetailDialogProps {
    isOpen: boolean;
    openChange: (open: boolean) => void;
    projectId: string;
    issueId: string;
}
export default function IssueDetailDialog({ isOpen, openChange, projectId, issueId }: IssueDetailDialogProps) {
    const { data: issue, isFetching } = useQuery(
        createIssueQueryOptions({ projectId, issueId }, {
            enabled: !!issueId,
            select: (response) => response.data,
        })
    );

    return (
        <Dialog open={isOpen} onOpenChange={openChange}>
            <DialogContent className="sm:max-w-sm">
                {isFetching ? (
                    <div className="p-8 flex justify-center">Đang tải...</div>
                ) : issue ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>{issue.title}</DialogTitle>
                            <DialogDescription>{issue.description}</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center items-center">
                            {/* Nội dung khác */}
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center">Không tìm thấy dữ liệu</div>
                )}
            </DialogContent>
        </Dialog>
    );
}