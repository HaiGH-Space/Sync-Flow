import { api } from "./api";

export enum ChannelType {
  GROUP = "GROUP",
  DIRECT = "DIRECT",
}

export interface Channel {
  id: string;
  name: string | null;
  type: ChannelType;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChannelRequest {
  name?: string;
  type: ChannelType;
  memberIds: string[];
}

async function getChannelsByProjectId(projectId: string) {
  return api.get<Channel[]>(`projects/${projectId}/channels`);
}

async function createChannel(projectId: string, request: CreateChannelRequest) {
  return api.post<Channel>(`projects/${projectId}/channels`, request);
}
export const channelService = {
  getChannelsByProjectId,
  createChannel,
};
