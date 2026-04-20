"use client";

import { useState } from "react";
import { ImageIcon, Mic, Paperclip, Send, Smile, Sticker } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActionIcon } from "./ActionIcon";

type ComposerProps = {
  onSendAction?: (value: string) => void;
};

export function Composer({ onSendAction }: ComposerProps) {
  const [value, setValue] = useState("");

  return (
    <div className="border-t border-border/70 pt-3">
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/70 p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <ActionIcon label="Attach file">
            <Paperclip className="size-4" />
          </ActionIcon>
          <ActionIcon label="Add image">
            <ImageIcon className="size-4" />
          </ActionIcon>
          <ActionIcon label="Emoji">
            <Smile className="size-4" />
          </ActionIcon>
          <ActionIcon label="Sticker">
            <Sticker className="size-4" />
          </ActionIcon>
          <ActionIcon label="Voice">
            <Mic className="size-4" />
          </ActionIcon>
          <span className="text-xs text-muted-foreground">
            Attachments and stickers coming soon
          </span>
        </div>

        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            placeholder="Write a message..."
            className="min-h-11 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Button
            type="button"
            className="h-10 gap-2"
            onClick={() => onSendAction?.(value)}
          >
            <Send className="size-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
