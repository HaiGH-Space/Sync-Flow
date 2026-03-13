import { queryOptions } from "@tanstack/react-query";
import { Issue, issueService } from "../api/issue";
import { QueryOptions } from "@/types/query-option";

export const issueKeys = {
    all: ['issues'] as const,
    list: (projectId: string) => [...issueKeys.all, projectId] as const,
};

export function createIssuesQueryOptions(params: { projectId: string }, options?: QueryOptions<Issue[]>) {
    const { projectId } = params;
    return queryOptions({
         ...options,
        queryKey: issueKeys.list(projectId),
        queryFn: () => issueService.getIssuesByProjectId(projectId),
        staleTime: 1000 * 60 * 5
    });
}