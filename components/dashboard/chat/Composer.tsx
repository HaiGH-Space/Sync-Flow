"use client";

import { useRef, useState, useCallback } from "react";
import { ImageIcon, Mic, Paperclip, Send, Smile, Sticker } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ActionIcon } from "./ActionIcon";
import { EmojiPicker } from "./EmojiPicker";

type ComposerProps = {
  onSendAction?: (value: string) => void;
};

export function Composer({ onSendAction }: ComposerProps) {
  const [value, setValue] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const keepEmojiPickerOpenRef = useRef(false);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSendAction?.(trimmed);
    setValue("");
    selectionRef.current = { start: 0, end: 0 };
  }, [value, onSendAction]);

  const syncSelection = useCallback(() => {
    if (textareaRef.current) {
      selectionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      };
    }
  }, []);

  const insertEmoji = useCallback((emoji: string) => {
    keepEmojiPickerOpenRef.current = true;

    const { start, end } = selectionRef.current;

    setValue((prev) => {
      const newValue = prev.substring(0, start) + emoji + prev.substring(end);
      return newValue;
    });

    const nextCursor = start + emoji.length;
    selectionRef.current = { start: nextCursor, end: nextCursor };

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextCursor, nextCursor);
      }
    });
  }, []);

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

          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Smile
                  className={`size-5 transition-colors ${
                    isEmojiOpen ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              sideOffset={10}
              className="w-auto p-0 border-none shadow-2xl rounded-xl"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => {
                if (e.target === textareaRef.current) e.preventDefault();
              }}
              onFocusOutside={(e) => {
                if (e.target === textareaRef.current) e.preventDefault();
              }}
            >
              <EmojiPicker onSelectAction={insertEmoji} />
            </PopoverContent>
          </Popover>

          <ActionIcon label="Sticker">
            <Sticker className="size-4" />
          </ActionIcon>
          <ActionIcon label="Voice">
            <Mic className="size-4" />
          </ActionIcon>
        </div>

        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            rows={2}
            placeholder="Viết tin nhắn..."
            className="min-h-11 flex-1 resize-none rounded-lg bg-background border-none focus-visible:ring-1 transition-all"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onSelect={syncSelection}
            onClick={syncSelection}
            onKeyUp={syncSelection}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!value.trim()}
            size="sm"
            className="h-9 px-4 active:scale-95 transition-transform"
          >
            <Send className="size-4 mr-2" />
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}
