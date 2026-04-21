import { api } from "./api";

export interface Message {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
}
export interface GetMessagesResponse {
  data: Message[];
  nextCursor: string | null;
}

async function getMessages(channelId: string, cursor: string | null) {
  const params = new URLSearchParams();
  if (cursor) {
    params.append("cursor", cursor);
  }

  const response = await api.get<Message[]>(
    `/channels/${channelId}/messages?${params.toString()}`,
  );

  return {
    data: response.data ?? [],
    nextCursor: null,
  };
}

export const messageService = {
  getMessages,
};
