"use client";

import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";

export function NavigationSidebarFooter() {
  return (
    <div className="p-4 border-t border-border">
      <AvatarWithBadge
        alt="user avatar"
        src="https://github.com/shadcn.png"
        avtFallback="CN"
        status="online"
      />
    </div>
  );
}
