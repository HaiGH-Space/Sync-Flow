import { api } from "./api"

export interface Column {
    id: string
    name: string
    projectId: string
    order: number
}

export type CreateColumn = Omit<Column, 'id' | 'projectId'>

export type UpdateColumn = Partial<CreateColumn>
async function getColumns({ projectId }: { projectId: string }) {
    return api.get<Column[]>(`/projects/${projectId}/columns`);
}

async function createColumn({ projectId, columnData }: { projectId: string; columnData: CreateColumn }) {
    return api.post<Column>(`/projects/${projectId}/columns`, columnData);
}

async function updateColumn({ projectId, columnId, columnData }: { projectId: string; columnId: string; columnData: UpdateColumn }) {
    return api.patch<Column>(`/projects/${projectId}/columns/${columnId}`, columnData);
}

async function deleteColumn({ projectId, columnId }: { projectId: string; columnId: string }) {
    return api.delete(`/projects/${projectId}/columns/${columnId}`);
}

export const columnService = {
    getColumns,
    createColumn,
    updateColumn,
    deleteColumn
}