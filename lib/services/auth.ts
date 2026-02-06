import { api } from "../api"
import { UserProfile } from "./user"

interface LoginRequest {
    email: string
    password: string
}

interface RegisterRequest {
    email: string
    password: string
    name: string
    image: string | null
}

async function login({ email, password }: LoginRequest) {
    return await api.post<UserProfile>("/auth/login", { email, password })
}

async function register({ email, password, name, image }: RegisterRequest) {
    return await api.post<UserProfile>("/auth/register", { email, password, name, image })
}

export const authService = {
    login, register
}