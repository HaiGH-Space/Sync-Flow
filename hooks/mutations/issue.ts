import { issueService } from '@/lib/api/issue';
import { issueKeys } from '@/queries/issue';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateIssue = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: issueService.createIssue,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) });
        },
    });
};

export const useDeleteIssue = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: issueService.deleteIssue,
        
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) });
        },
    });
};