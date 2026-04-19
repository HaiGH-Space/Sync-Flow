import { queryOptions } from "@tanstack/react-query";
import type { QueryOptions } from "@/types/query-option";
import type { ApiResponse } from "@/lib/api/api";
import type { Channel } from "@/lib/api/channel";
import { channelService } from "@/lib/api/channel";

export const channelKeys = {
  all: ["channels"] as const,
  list: (projectId: string) => [...channelKeys.all, projectId] as const,
};

export function createChannelsQueryOptions<TData = ApiResponse<Channel[]>>(
  params: { projectId: string },
  options?: QueryOptions<Channel[], TData>,
) {
  const { projectId } = params;

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: channelKeys.list(projectId),
    queryFn: () => channelService.getChannelsByProjectId(projectId),
  });
}
