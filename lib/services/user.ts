import { api, ApiResponse } from "../api"

export interface UserProfile {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    image?: string
}

async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return await api.get<UserProfile>('/users/me');
}

export const userService = {
    getUserProfile
}