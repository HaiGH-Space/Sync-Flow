import { uploadService } from "@/lib/api/upload";
import { useMutation } from "@tanstack/react-query";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadService.uploadFile,
  });
};
