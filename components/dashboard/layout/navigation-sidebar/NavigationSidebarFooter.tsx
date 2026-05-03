"use client";

import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { useProfile } from "@/hooks/use-profile";
import { useUpdateMyAvatar } from "@/hooks/mutations/user";
import { uploadService } from "@/lib/api/upload";
import { ApiRequestError } from "@/lib/api/api";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import { toast } from "sonner";

export function NavigationSidebarFooter() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: userProfile } = useProfile();
  const updateAvatarMutation = useUpdateMyAvatar();

  const src = userProfile?.image ?? "";
  const alt = userProfile?.name ? `${userProfile.name} avatar` : "user avatar";
  const avtFallback = (userProfile?.name ?? "U").charAt(0).toUpperCase();

  const onPickAvatar = () => {
    if (updateAvatarMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const toastId = "update-avatar";
    toast.loading("Updating avatar...", { id: toastId });

    try {
      await updateAvatarMutation.mutateAsync({ file, filename: file.name });
      toast.success("Avatar updated", { id: toastId });
    } catch {
      try {
        const uploadRes = await uploadService.uploadFile({
          file,
          filename: file.name,
          folder: "avatars",
        });
        await updateAvatarMutation.mutateAsync({ image: uploadRes.data.url });
        toast.success("Avatar updated", { id: toastId });
      } catch (fallbackErr) {
        const message =
          fallbackErr instanceof ApiRequestError
            ? fallbackErr.message
            : fallbackErr instanceof Error
              ? fallbackErr.message
              : "Update avatar failed";
        toast.error(message, { id: toastId });
      }
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <button
        type="button"
        onClick={onPickAvatar}
        disabled={updateAvatarMutation.isPending}
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        aria-label="Update avatar"
      >
        <AvatarWithBadge
          alt={alt}
          src={src}
          avtFallback={avtFallback}
          status="online"
        />
      </button>
    </div>
  );
}
