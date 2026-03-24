import { useMutation, useQueryClient } from '@tanstack/react-query';

import { commentService } from '@/lib/api/comment';
import { commentKeys } from '@/queries/comment';

export const useCreateComment = (issueId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.createComment,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: commentKeys.list(issueId) });
        },
    });
};