import { http } from './http'
import type {
    BasicActionResponse,
    FriendRequestCreateRequest,
    FriendRequestItem,
    FriendRequestRespondRequest
} from '../types/api'

export async function sendFriendRequest(payload: FriendRequestCreateRequest): Promise<BasicActionResponse> {
    const res = await http.post<BasicActionResponse>('/api/friends/request', payload)
    return res.data
}

export async function getIncomingFriendRequests(): Promise<FriendRequestItem[]> {
    const res = await http.get<FriendRequestItem[]>('/api/friends/requests')
    return res.data
}

export async function respondToFriendRequest(payload: FriendRequestRespondRequest): Promise<BasicActionResponse> {
    const res = await http.post<BasicActionResponse>('/api/friends/respond', payload)
    return res.data
}
