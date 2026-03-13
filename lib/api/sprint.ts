import { api } from "./api"

type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED'

export interface Sprint {
    id: string
    name: string
    goal: string | null
    startDate: string | null
    endDate: string | null
    projectId: string
    createdAt: string
    updatedAt: string
    status: SprintStatus
}

type CreateSprint = Omit<Sprint, 'id' | 'createdAt' | 'updatedAt' | 'status'>

interface DeleteSprintRequest {
    projectId: string
    sprintId: string
}

interface UpdateSprintRequest {
    projectId: string
    sprintId: string
    sprint: Partial<CreateSprint>
}

interface CreateSprintRequest {
    projectId: string
    sprint: CreateSprint
}

async function getSprint({ projectId }: { projectId: string }) {
    return api.get<Sprint[]>(`projects/${projectId}/sprints`)
}
async function deleteSprint({ projectId, sprintId }: DeleteSprintRequest) {
    return api.delete(`projects/${projectId}/sprints/${sprintId}`)
}

async function createSprint({ projectId, sprint }: CreateSprintRequest) {
    return api.post<Sprint>(`projects/${projectId}/sprints`, sprint)
}
async function updateSprint({ projectId, sprintId, sprint }: UpdateSprintRequest) {
    return api.patch<Sprint>(`projects/${projectId}/sprints/${sprintId}`, sprint)
}
export const sprintService = {
    getSprint,
    deleteSprint,
    createSprint,
    updateSprint
}