import { api, ApiResponse } from "../api"

const USER_BASE_URL = '/users';

export interface UserProfile {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    image?: string
}

async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return await api.get<UserProfile>(`${USER_BASE_URL}/me`);
}

export const userService = {
    getUserProfile
}