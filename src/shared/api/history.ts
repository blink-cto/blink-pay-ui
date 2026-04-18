import { http } from './http'
import type { TransactionDto } from '../types/api'

export async function getTransactionFeed(): Promise<TransactionDto[]> {
    const res = await http.get<TransactionDto[]>('/api/user/transaction-history/feed')
    return res.data
}

export async function getOutwardHistory(): Promise<TransactionDto[]> {
    const res = await http.get<TransactionDto[]>('/api/user/transaction-history/outward')
    return res.data
}

export async function getInwardHistory(): Promise<TransactionDto[]> {
    const res = await http.get<TransactionDto[]>('/api/user/transaction-history/inward')
    return res.data
}

export async function getTransaction(id: number): Promise<TransactionDto> {
    const res = await http.get<TransactionDto>(`/api/user/transaction-history/${id}`)
    return res.data
}
