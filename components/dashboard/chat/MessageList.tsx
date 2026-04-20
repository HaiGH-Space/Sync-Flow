import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "./types";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
  currentUserId: string;
};

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 min-h-0 py-4">
      <div className="flex flex-col gap-4 pr-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={message.sender.id === currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
