import { http } from './http'
import type { MyProfileResponse, QrDataResponse, UserSearchItem } from '../types/api'

export async function searchUsers(query: string): Promise<UserSearchItem[]> {
    const res = await http.get<(UserSearchItem & { userId?: number })[]>('/api/users/search', { params: { query } })
    // normalise: backend may return `userId` (old) or `id` (new contract)
    return res.data.map((u) => ({ ...u, id: u.id ?? u.userId ?? 0 }))
}

export async function getMe(): Promise<MyProfileResponse> {
    const res = await http.get<MyProfileResponse>('/api/users/me')
    return res.data
}

export async function getMyQrData(): Promise<QrDataResponse> {
    const res = await http.get<QrDataResponse>('/api/users/me/qr-data')
    return res.data
}
