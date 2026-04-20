"use client";

import { ChannelHeader } from "@/components/dashboard/chat/ChannelHeader";
import { Composer } from "@/components/dashboard/chat/Composer";
import { MessageList } from "@/components/dashboard/chat/MessageList";
import { mockMessages } from "@/components/dashboard/chat/mock";

export default function ChannelPage() {
  const currentUserId = "u2";
  const messages = mockMessages;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChannelHeader />
      <MessageList messages={messages} currentUserId={currentUserId} />
      <Composer />
    </div>
  );
}
