import { api } from "./api";
import { UserProfile } from "./user";

export interface MemberWorkspace {
    id: string,
    workspaceId: string,
    userId: string,
    role: 'ADMIN' | 'MEMBER',
    joinedAt: string
}

async function getWorkspaceMembersProfile(workspaceId: string) {
    return api.get<UserProfile[]>(`/workspaces/${workspaceId}/members/profile`);
}

export const workspaceMemberService = {
    getWorkspaceMembersProfile
};