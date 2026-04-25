"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import emojiLibData from "emojilib";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type EmojiPickerProps = {
  onSelectAction: (emoji: string) => void;
};

export function EmojiPicker({ onSelectAction }: EmojiPickerProps) {
  const [search, setSearch] = useState("");

  const filteredEmojis = useMemo(() => {
    const query = search.toLowerCase();
    const entries = Object.entries(emojiLibData);
    if (!query) return entries.slice(0, 500);
    return entries.filter(([, keywords]) =>
      keywords.some((k) => k.includes(query)),
    );
  }, [search]);

  return (
    <div className="flex flex-col h-105 w-full sm:w-87.5 bg-popover text-popover-foreground rounded-xl border shadow-2xl overflow-hidden">
      {/* Header: Search */}
      <div className="p-4 border-b border-border/50 bg-popover/95 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm emoji..."
            className="pl-9 h-10 bg-muted/50 border-none focus-visible:ring-1 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="grid grid-cols-6 gap-2">
              {filteredEmojis.map(([emoji, keywords]) => (
                <button
                  key={emoji}
                  title={keywords.join(", ")}
                  onClick={() => onSelectAction(emoji)}
                  className="flex items-center justify-center size-11 text-2xl hover:bg-accent rounded-xl transition-all active:scale-75 hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {filteredEmojis.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="size-8 mb-2 opacity-20" />
                <p className="text-xs">Không tìm thấy emoji</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer: Thông tin */}
      <div className="py-2 border-t border-border/40 bg-muted/5 text-[9px] text-center text-muted-foreground/50 uppercase tracking-widest font-bold">
        {filteredEmojis.length} Emojis Found
      </div>
    </div>
  );
}
