import { api } from "../api"
import { UserProfile } from "./user"

interface LoginRequest {
    email: string
    password: string
}

export const login = async ({ email, password }: LoginRequest) => {
    return api.post<UserProfile>("/auth/login", { email, password })
}