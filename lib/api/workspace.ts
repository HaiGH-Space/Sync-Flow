import { api, ApiResponse } from "./api"
import { MemberWorkspace } from "./member-workspace"

export const WORKSPACE_BASE_URL = '/workspaces';

export interface Workspace {
    id: string,
    name: string,
    urlSlug: string,
    ownerId: string
    createdAt: string,
    updatedAt: string,
    members?: MemberWorkspace[]
}

async function getMyWorkspace(): Promise<ApiResponse<Workspace[]>> {
    return api.get<Workspace[]>(`${WORKSPACE_BASE_URL}/me`)
}

async function getWorkspaceById(workspaceId: string): Promise<ApiResponse<Workspace>> {
    return api.get<Workspace>(`${WORKSPACE_BASE_URL}/${workspaceId}`)
}

export const workspaceService = {
    getMyWorkspace,
    getWorkspaceById
}