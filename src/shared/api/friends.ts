import { http } from './http'
import type {
    FriendItem,
    FriendRequestCreateRequest,
    FriendRequestItem,
    FriendRequestRespondRequest,
} from '../types/api'

export async function getFriends(): Promise<FriendItem[]> {
    const res = await http.get<FriendItem[]>('/api/friends')
    return res.data
}

export async function sendFriendRequest(payload: FriendRequestCreateRequest): Promise<void> {
    await http.post('/api/friends/request', payload)
}

export async function getIncomingFriendRequests(): Promise<FriendRequestItem[]> {
    const res = await http.get<FriendRequestItem[]>('/api/friends/requests')
    return res.data
}

export async function respondToFriendRequest(payload: FriendRequestRespondRequest): Promise<void> {
    await http.post('/api/friends/respond', payload)
}

export async function removeFriend(friendId: number): Promise<void> {
    await http.delete(`/api/friends/${friendId}`)
}
