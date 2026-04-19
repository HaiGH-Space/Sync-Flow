"use client";

import { useParams } from "next/navigation";

export default function ChannelPage() {
  const { channelId } = useParams<{ channelId: string }>();

  return (
    <div className="flex h-full flex-col gap-3">
      <div>
        <h1 className="text-lg font-semibold">Channel</h1>
        <p className="text-sm text-muted-foreground">{channelId}</p>
      </div>
      <div className="rounded-lg border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
        Messages view coming soon.
      </div>
    </div>
  );
}
