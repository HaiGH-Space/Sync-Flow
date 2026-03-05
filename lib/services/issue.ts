import { api } from "../api";
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

export type Priority = "LOW" | "MEDIUM" | "HIGH";

type CreateIssue = {
    columnId: string
    order: number
    title: string
    priority: Priority
    assigneeId?: string
    description?: string
}

async function getIssuesByProjectId(projectId: string) {
    return api.get<Issue[]>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}`);
}

async function createIssue(projectId: string, issueData: CreateIssue) {
    return api.post<Issue>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}`, issueData);
}

async function updateIssue(projectId: string, issueId: string, issueData: Partial<CreateIssue>) {
    return api.patch<Issue>(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}/${issueId}`, issueData);
}

async function deleteIssue(projectId: string, issueId: string) {
    return api.delete(`${PROJECT_BASE_URL}/${projectId}${ISSUE_BASE_URL}/${issueId}`);
}

export const issueService = {
    getIssuesByProjectId,
    createIssue,
    updateIssue,
    deleteIssue
}