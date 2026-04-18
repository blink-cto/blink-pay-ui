import { http } from '../../shared/api/http'
import type { AuthResponse } from '../../shared/types/api'

export type { AuthResponse }

export type LoginRequest = {
    email: string
    password: string
}

export type RegisterRequest = {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
}

const LOGIN_PATH = '/api/auth/login'
const REGISTER_PATH = '/api/auth/register'

export async function login(payload: LoginRequest): Promise<AuthResponse> {
    const res = await http.post<AuthResponse>(LOGIN_PATH, payload)
    return res.data
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
    const res = await http.post<AuthResponse>(REGISTER_PATH, payload)
    return res.data
}
