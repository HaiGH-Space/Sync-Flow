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

