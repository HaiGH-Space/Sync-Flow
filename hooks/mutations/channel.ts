import { useMutation, useQueryClient } from "@tanstack/react-query";

import { channelService } from "@/lib/api/channel";
import { channelKeys } from "@/queries/channel";

export const useCreateChannel = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Parameters<typeof channelService.createChannel>[1]) =>
      channelService.createChannel(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: channelKeys.list(projectId),
      });
    },
  });
};
