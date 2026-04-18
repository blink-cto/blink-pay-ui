import { http } from './http'
import type { DebtItem } from '../types/api'

export async function getMyDebts(): Promise<DebtItem[]> {
    const res = await http.get<DebtItem[]>('/api/debts/me')
    return res.data
}

export async function getMyRequests(): Promise<DebtItem[]> {
    const res = await http.get<DebtItem[]>('/api/debts/requests')
    return res.data
}
