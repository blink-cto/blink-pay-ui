import { http } from './http'
import type {
    BasicActionResponse,
    SettleDebtRequest,
    SplitPaymentRequest,
    SplitPaymentResponse
} from '../types/api'

export async function splitPayment(payload: SplitPaymentRequest): Promise<SplitPaymentResponse> {
    const res = await http.post<SplitPaymentResponse>('/api/payments/split', payload)
    return res.data
}

export async function settleDebt(payload: SettleDebtRequest): Promise<BasicActionResponse> {
    const res = await http.post<BasicActionResponse>('/api/payments/settle', payload)
    return res.data
}
