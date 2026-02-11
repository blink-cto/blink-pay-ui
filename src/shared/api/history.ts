import { http } from './http'
import type { TransactionHistoryItem } from '../types/api'

export async function getOutwardHistory(): Promise<TransactionHistoryItem[]> {
    const res = await http.get<TransactionHistoryItem[]>('/api/user/transaction-history/outward')
    return res.data
}

export async function getInwardHistory(): Promise<TransactionHistoryItem[]> {
    const res = await http.get<TransactionHistoryItem[]>('/api/user/transaction-history/inward')
    return res.data
}
