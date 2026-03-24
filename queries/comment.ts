import { ApiResponse } from "@/lib/api/api";
import { Comment, commentService } from "@/lib/api/comment";
import { QueryOptions } from "@/types/query-option";
import { queryOptions } from "@tanstack/react-query";

export const commentKeys = {
    all: ['comments'] as const,
    list: (issueId: string) => [...commentKeys.all, issueId] as const,
};

export function createCommentsQueryOptions<
    TData = ApiResponse<Comment[]>
>(params: { issueId: string }, options?: QueryOptions<Comment[], TData>) {
    const { issueId } = params;
    return queryOptions({
        staleTime: 1000 * 60 * 5,
        ...options,
        queryKey: commentKeys.list(issueId),
        queryFn: () => commentService.getCommentsByIssue({ issueId}),
    });
}