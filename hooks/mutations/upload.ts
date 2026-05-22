import { uploadService } from "@/lib/api/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadService.uploadFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
