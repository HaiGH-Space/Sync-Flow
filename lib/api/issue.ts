import { api } from "./api";
import { PROJECT_BASE_URL } from "./project";

const ISSUE_BASE_URL = '/issues';

export interface Issue {
    id: string;
    number: number;
    title: string;
    description: string;
    priority: Priority;
    order: number;
    columnId: string;
    projectId: string;
    assigneeId: string | null;
    reporterId: string;
    sprintId: string | null;
    createdAt: string;
    updatedAt: string;
}
export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export type CreateIssue = {
    columnId: string
    title: string
    priority: Priority
    assigneeId?: string | null
    description?: string
    order: number
}

type UpdateIssue = Partial<CreateIssue> & {
    order?: number
}

async function getIssuesByProjectId(projectId: string) {
    return api.get<Issue[]>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}`);
}

async function getIssueById({ projectId, issueId }: { projectId: string; issueId: string }) {
    return api.get<Issue>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}/${issueId}`);
}

async function createIssue({ projectId, issueData }: { projectId: string; issueData: CreateIssue }) {
    return api.post<Issue>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}`, issueData);
}

async function updateIssue({ projectId, issueId, issueData }: { projectId: string; issueId: string; issueData: UpdateIssue }) {
    return api.patch<Issue>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}/${issueId}`, issueData);
}

async function deleteIssue({ projectId, issueId }: { projectId: string; issueId: string }) {
    return api.delete(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}/${issueId}`);
}

export const issueService = {
    getIssuesByProjectId,
    createIssue,
    updateIssue,
    deleteIssue,
    getIssueById,
}