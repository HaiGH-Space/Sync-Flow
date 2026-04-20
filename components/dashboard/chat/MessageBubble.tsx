import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

type MessageBubbleProps = {
  message: ChatMessage;
  isMine: boolean;
};

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isMine ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar size="default">
        <AvatarFallback>
          {message.sender.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl border px-3 py-2 text-sm shadow-sm",
          isMine
            ? "border-primary/30 bg-primary/10 text-foreground"
            : "border-border/70 bg-background",
        )}
      >
        <div className="flex items-center justify-between gap-3 pb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {message.sender.name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {message.createdAt}
          </span>
        </div>
        <p className="leading-relaxed text-foreground/90">{message.content}</p>
      </div>
    </div>
  );
}
