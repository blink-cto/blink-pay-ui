import { http } from '../../shared/api/http'

export type LoginRequest = {
    email: string
    password: string
}

export type RegisterRequest = {
    firstName: string
    lastName: string
    email: string
    password: string
    username: string
}

export type AuthResponse = {
    token: string
    firstName: string
    email: string
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
