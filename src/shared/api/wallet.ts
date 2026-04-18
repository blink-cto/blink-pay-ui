import { http } from './http'
import type { TopUpInitiateResponse, WalletResponse } from '../types/api'

export async function getMyWallet(): Promise<WalletResponse> {
    const res = await http.get<WalletResponse>('/api/wallets/my-wallet')
    return res.data
}

export async function initiateTopUp(amount: string): Promise<TopUpInitiateResponse> {
    const res = await http.post<TopUpInitiateResponse>('/api/wallets/top-up/initiate', { amount })
    return res.data
}

export async function directTopUp(amount: number): Promise<WalletResponse> {
    const res = await http.post<WalletResponse>('/api/wallets/top-up', { amount })
    return res.data
}

export async function cashOut(amount: number): Promise<WalletResponse> {
    const res = await http.post<WalletResponse>('/api/wallets/cashout', { amount })
    return res.data
}
