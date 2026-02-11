import { http } from './http'
import type { MyProfileResponse, UserSearchItem } from '../types/api'

export async function searchUsers(query: string): Promise<UserSearchItem[]> {
    const res = await http.get<UserSearchItem[]>('/api/users/search', { params: { query } })
    return res.data
}

export async function getMe(): Promise<MyProfileResponse> {
    const res = await http.get<MyProfileResponse>('/api/users/me')
    return res.data
}
