import { ApiResponse } from "@/lib/api/api";
import { QueryOptions as QueryOptionsTanstack } from "@tanstack/react-query";
export type QueryOptions<T> = Omit<QueryOptionsTanstack<ApiResponse<T>>, 'queryKey' | 'queryFn'>;