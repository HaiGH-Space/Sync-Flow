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

export type CreateWorkspace = {
    name: string
    urlSlug: string
}

async function getMyWorkspace(): Promise<ApiResponse<Workspace[]>> {
    return api.get<Workspace[]>(`${WORKSPACE_BASE_URL}/me`)
}

async function getWorkspaceById(workspaceId: string): Promise<ApiResponse<Workspace>> {
    return api.get<Workspace>(`${WORKSPACE_BASE_URL}/${workspaceId}`)
}

async function createWorkspace({ name, urlSlug }: CreateWorkspace): Promise<ApiResponse<Workspace>> {
    return api.post<Workspace>(WORKSPACE_BASE_URL, { name, urlSlug })
}

export const workspaceService = {
    getMyWorkspace,
    getWorkspaceById,
    createWorkspace
}