export type ChatSender = {
  id: string;
  name: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  sender: ChatSender;
  createdAt: string;
};
