import { api } from "./api";
import { ISSUE_BASE_URL } from "./issue";

const commentBaseUrl = '/comments';

export interface Comment {
    id: string
    content: string
    createdAt: string
    userId: string
    updatedAt: string
}

type CreateComment = {
    content: string
    userId: string
}

type UpdateComment = {
    content: string
}

async function getCommentsByIssue({ issueId } : { issueId: string }) {
    return api.get<Comment[]>(`${ISSUE_BASE_URL}/${issueId}${commentBaseUrl}`);
}

async function createComment({ issueId, data } : { issueId: string, data: CreateComment }) {
    return api.post<Comment>(`${ISSUE_BASE_URL}/${issueId}${commentBaseUrl}`, data);
}

async function updateComment({ issueId, commentId, data } : { issueId: string, commentId: string, data: UpdateComment }) {
    return api.patch<Comment>(`${ISSUE_BASE_URL}/${issueId}${commentBaseUrl}/${commentId}`, data);
}

async function deleteComment({ issueId, commentId } : { issueId: string, commentId: string }) {
    return api.delete(`${ISSUE_BASE_URL}/${issueId}${commentBaseUrl}/${commentId}`);
}

export const commentService = {
    getCommentsByIssue,
    createComment,
    updateComment,
    deleteComment
}