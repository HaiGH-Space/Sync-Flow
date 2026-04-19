import { GetMessagesResponse, messageService } from "@/lib/api/message";
import { CustomInfiniteQueryOptions } from "@/types/query-option";
import { InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";

export const messageKeys = {
  all: ["messages"] as const,
  list: (channelId: string) => [...messageKeys.all, channelId] as const,
};

export function createMessagesInfiniteOptions<
  TData = InfiniteData<GetMessagesResponse>,
>(
  params: { channelId: string },
  options?: CustomInfiniteQueryOptions<GetMessagesResponse, TData>,
) {
  const { channelId } = params;

  return infiniteQueryOptions({
    staleTime: 1000 * 60 * 5,
    enabled: !!channelId,
    ...options,
    queryKey: messageKeys.list(channelId),
    queryFn: ({ pageParam }) =>
      messageService.getMessages(channelId, pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? null;
    },
  });
}
