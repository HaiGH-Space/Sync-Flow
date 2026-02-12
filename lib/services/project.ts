import { api } from "../api"
import { Column } from "./column";

export interface Project {
    id: string;
    name: string;
    key: string;
    description?: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    columns?: Column[] 
}

async function getProjectsByWorkspaceId({workspaceId}: {workspaceId: string}) {
    return api.get<Project[]>(`/workspaces/${workspaceId}/projects`);
}

export const projectService = {
    getProjectsByWorkspaceId
}