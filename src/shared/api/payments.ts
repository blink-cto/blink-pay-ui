import { http } from './http'
import type {
    MoneyRequestRequest,
    MoneyRequestResponse,
    QrLinkRequest,
    QrLinkResolveResponse,
    QrLinkResponse,
    SendPaymentRequest,
    SendPaymentResponse,
    SettleDebtRequest,
    SplitPaymentRequest,
    SplitPaymentResponse,
} from '../types/api'

export async function sendPayment(payload: SendPaymentRequest): Promise<SendPaymentResponse> {
    const res = await http.post<SendPaymentResponse>('/api/payments/send', payload)
    return res.data
}

export async function splitPayment(payload: SplitPaymentRequest): Promise<SplitPaymentResponse> {
    const res = await http.post<SplitPaymentResponse>('/api/payments/split', payload)
    return res.data
}

export async function settleDebt(payload: SettleDebtRequest): Promise<void> {
    await http.post('/api/payments/settle', payload)
}

export async function requestMoney(payload: MoneyRequestRequest): Promise<MoneyRequestResponse> {
    const res = await http.post<MoneyRequestResponse>('/api/payments/request', payload)
    return res.data
}

export async function cancelRequest(requestId: number): Promise<void> {
    await http.post(`/api/payments/request/${requestId}/cancel`)
}

export async function declineRequest(requestId: number): Promise<void> {
    await http.post(`/api/payments/request/${requestId}/decline`)
}

export async function createQrLink(payload: QrLinkRequest): Promise<QrLinkResponse> {
    const res = await http.post<QrLinkResponse>('/api/payments/qr-link', payload)
    return res.data
}

export async function resolveQrLink(token: string): Promise<QrLinkResolveResponse> {
    const res = await http.get<QrLinkResolveResponse>(`/api/payments/qr-link/${token}`)
    return res.data
}
