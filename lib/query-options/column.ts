import { Column, columnService } from '@/lib/api/column';
import { QueryOptions } from '@/types/query-option';
import { queryOptions } from '@tanstack/react-query';
import { ApiResponse } from '../api/api';


export const columnKeys = {
    all: ['columns'] as const,
    list: (projectId: string) => [...columnKeys.all, projectId] as const,
};

export function createColumnsQueryOptions<TData = ApiResponse<Column[]>>(
    params: { projectId: string },
    options?: QueryOptions<Column[], TData>
) {
    const { projectId } = params;
    return queryOptions({
        staleTime: 1000 * 60 * 5,
        ...options,
        queryKey: columnKeys.list(projectId),
        queryFn: () => columnService.getColumns({ projectId }),
    });
}