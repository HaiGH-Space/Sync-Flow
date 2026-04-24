"use client";

import { useRef, useState } from "react";
import { ImageIcon, Mic, Paperclip, Send, Smile, Sticker } from "lucide-react";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ActionIcon } from "./ActionIcon";

type ComposerProps = {
  onSendAction?: (value: string) => void;
};

export function Composer({ onSendAction }: ComposerProps) {
  const [value, setValue] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onSendAction?.(trimmed);
    setValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    handleSend();
  };

  const updateSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    selectionRef.current = {
      start: textarea.selectionStart ?? value.length,
      end: textarea.selectionEnd ?? value.length,
    };
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    const { start, end } = selectionRef.current;

    setValue((current) => {
      const next = `${current.slice(0, start)}${emoji}${current.slice(end)}`;

      requestAnimationFrame(() => {
        textarea?.focus();
        const cursorPosition = start + emoji.length;
        textarea?.setSelectionRange(cursorPosition, cursorPosition);
        selectionRef.current = {
          start: cursorPosition,
          end: cursorPosition,
        };
      });

      return next;
    });

    setIsEmojiOpen(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    insertEmoji(emojiData.emoji);
  };

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
                size="icon-sm"
                aria-label="Emoji"
                aria-expanded={isEmojiOpen}
              >
                <Smile className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-89 p-2">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height={320}
                lazyLoadEmojis
                theme={Theme.DARK}
                searchPlaceHolder="Tìm emoji"
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </PopoverContent>
          </Popover>
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
          <Textarea
            ref={textareaRef}
            rows={2}
            placeholder="Write a message..."
            className="min-h-11 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              selectionRef.current = {
                start:
                  event.currentTarget.selectionStart ??
                  event.target.value.length,
                end:
                  event.currentTarget.selectionEnd ?? event.target.value.length,
              };
            }}
            onSelect={updateSelection}
            onClick={updateSelection}
            onKeyUp={updateSelection}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            className="h-10 gap-2"
            onClick={handleSend}
            disabled={!value.trim()}
          >
            <Send className="size-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
