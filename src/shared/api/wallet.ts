import { http } from './http'
import type { TopUpInitiateResponse, WalletResponse } from '../types/api'

export async function getMyWallet(): Promise<WalletResponse> {
    const res = await http.get<WalletResponse>('/api/wallets/my-wallet')
    return res.data
}

export async function initiateTopUp(amount: number): Promise<TopUpInitiateResponse> {
    const res = await http.post<TopUpInitiateResponse>('/api/wallets/top-up/initiate', { amount })
    return res.data
}
