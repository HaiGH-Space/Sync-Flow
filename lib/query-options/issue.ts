import { queryOptions } from "@tanstack/react-query";
import { Issue, issueService } from "../api/issue";
import { QueryOptions } from "@/types/query-option";
import { ApiResponse } from "../api/api";

export const issueKeys = {
    all: ['issues'] as const,
    list: (projectId: string) => [...issueKeys.all, projectId] as const,
};

export function createIssuesQueryOptions<
    TData = ApiResponse<Issue[]>
>(params: { projectId: string }, options?: QueryOptions<Issue[], TData>) {
    const { projectId } = params;
    return queryOptions({
        staleTime: 1000 * 60 * 5,
        ...options,
        queryKey: issueKeys.list(projectId),
        queryFn: () => issueService.getIssuesByProjectId(projectId),
    });
}