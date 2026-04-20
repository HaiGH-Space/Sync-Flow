import type { ChatMessage } from "./types";

export const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    content: "Team, quick update: demo is tomorrow 10:00 AM.",
    sender: { id: "u1", name: "Mina" },
    createdAt: "09:12",
  },
  {
    id: "m2",
    content: "Got it. I will finalize the backlog grooming slides.",
    sender: { id: "u2", name: "You" },
    createdAt: "09:14",
  },
  {
    id: "m3",
    content:
      "Do we want to show the new channel sidebar? It looks smooth with sticky actions.",
    sender: { id: "u3", name: "An" },
    createdAt: "09:16",
  },
  {
    id: "m4",
    content: "Yes, that is the highlight. I will walk through the flow.",
    sender: { id: "u2", name: "You" },
    createdAt: "09:18",
  },
];
