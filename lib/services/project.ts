import { api } from "../api"
import { Column } from "./column";
import { WORKSPACE_BASE_URL } from "./workspace";
const PROJECT_BASE_URL = '/projects';

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

type CreateProject = {
    name: string
    key: string
    description?: string
}

type UpdateProject = Partial<CreateProject>

interface CreateProjectRequest {
    workspaceId: string
    project: CreateProject
}

interface UpdateProjectRequest {
    workspaceId: string
    projectId: string
    project: UpdateProject
}

interface DeleteProjectRequest {
    workspaceId: string
    projectId: string
}

async function getProjectsByWorkspaceId({workspaceId}: {workspaceId: string}) {
    return api.get<Project[]>(`${WORKSPACE_BASE_URL}/${workspaceId}${PROJECT_BASE_URL}`);
}

async function createProject({workspaceId, project}: CreateProjectRequest) {
    return api.post<Project>(`${WORKSPACE_BASE_URL}/${workspaceId}${PROJECT_BASE_URL}`, project);
}

async function updateProject({workspaceId, projectId, project}: UpdateProjectRequest) {
    return api.patch<Project>(`${WORKSPACE_BASE_URL}/${workspaceId}${PROJECT_BASE_URL}/${projectId}`, project);
}

async function deleteProject({workspaceId, projectId}: DeleteProjectRequest) {
    return api.delete(`${WORKSPACE_BASE_URL}/${workspaceId}${PROJECT_BASE_URL}/${projectId}`);
}
export const projectService = {
    getProjectsByWorkspaceId,
    createProject,
    updateProject,
    deleteProject
}