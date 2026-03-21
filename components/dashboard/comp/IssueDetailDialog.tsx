'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // Đảm bảo bạn đã npx shadcn-ui@latest add skeleton
import { cn } from "@/lib/utils";
import { createIssueQueryOptions } from "@/queries/issue";
import { useQuery } from "@tanstack/react-query";
import { Flag, User2 } from "lucide-react";
import { format } from "date-fns";

interface IssueDetailDialogProps {
    isOpen: boolean;
    openChange: (open: boolean) => void;
    projectId: string;
    issueId: string;
}

export default function IssueDetailDialog({ isOpen, openChange, projectId, issueId }: IssueDetailDialogProps) {
    const { data: issue, isLoading, isError } = useQuery(
        createIssueQueryOptions({ projectId, issueId }, {
            enabled: !!issueId && isOpen,
            select: (response) => response.data,
        })
    );

    return (
        <Dialog open={isOpen} onOpenChange={openChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {isLoading ? (
                    <>
                        <DialogTitle className="sr-only">Đang tải chi tiết công việc</DialogTitle>
                        <IssueDetailSkeleton />
                    </>
                ) : isError || !issue ? (
                    <>
                        <DialogTitle className="sr-only">Lỗi tải dữ liệu</DialogTitle>
                        <DialogDescription className="sr-only">Đã xảy ra lỗi khi tải chi tiết công việc.</DialogDescription>
                        <IssueDetailSkeleton />
                    </>
                ) : (
                    <>
                        <DialogHeader className="px-1">
                            <DialogTitle className="text-2xl font-semibold">ISSUE {issue.number} - {issue.title}</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="flex-1 pr-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                                {/* Details and COMMENTS */}
                                <div className="md:col-span-2 space-y-8">
                                    <div>
                                        <h3 className="font-medium mb-2">Mô tả</h3>
                                        <div className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-md border">
                                            {issue.description || <span className="italic text-muted-foreground">Không có mô tả.</span>}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Bình luận</h3>
                                        <div className="flex gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 bg-muted p-3 rounded-lg border text-sm text-muted-foreground cursor-text hover:bg-muted/80 transition-colors">
                                                Viết bình luận...
                                            </div>
                                        </div>
                                        <div className="flex justify-center py-8 border-dashed border-2 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Chưa có bình luận nào.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SIDEBAR */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <span className="text-xs font-semibold uppercase text-muted-foreground">Trạng thái</span>
                                            <div><Badge variant="secondary">{issue.columnId}</Badge></div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <span className="text-xs font-semibold uppercase text-muted-foreground">Người thực hiện</span>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback><User2 className="w-3 h-3" /></AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{issue.assigneeId || "Chưa giao"}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <span className="text-xs font-semibold uppercase text-muted-foreground">Độ ưu tiên</span>
                                            <div className="flex items-center gap-2">
                                                <Flag className={cn("w-4 h-4",
                                                    issue.priority === 'HIGH' ? "text-red-500" :
                                                        issue.priority === 'MEDIUM' ? "text-yellow-500" : "text-green-500"
                                                )} />
                                                <span className="text-sm capitalize">{issue.priority.toLowerCase()}</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Người tạo:</span>
                                                <span className="font-medium text-xs truncate max-w-[120px]">{issue.reporterId}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Ngày tạo:</span>
                                                <span className="text-xs">{format(new Date(issue.createdAt), 'dd MMM yyyy')}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Cập nhật:</span>
                                                <span className="text-xs">{format(new Date(issue.updatedAt), 'dd MMM yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

// COMPONENT SKELETON NẰM TRONG CÙNG FILE HOẶC TÁCH RA
function IssueDetailSkeleton() {
    return (
        <>
            <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-3/4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-10 flex-1" />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ))}
                    <Separator />
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            </div>
        </>
    );
}