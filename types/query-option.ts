import { ApiRequestError, ApiResponse } from "@/lib/api/api";
import { UseQueryOptions } from "@tanstack/react-query";
export type QueryOptions<T, TData> = Omit<
    UseQueryOptions<ApiResponse<T>, ApiRequestError, TData>, 
    'queryKey' | 'queryFn'
>;