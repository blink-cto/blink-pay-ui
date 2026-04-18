// Shared DTOs — mirrors the backend API contract

// ─── Envelope ────────────────────────────────────────────────────────
export type ApiEnvelope<T> = {
    success: boolean
    message: string | null
    data: T | null
}

// ─── Common ──────────────────────────────────────────────────────────
export type SimpleUser = {
    id: number
    firstName: string
    email: string
}

// ─── Auth ─────────────────────────────────────────────────────────────
export type AuthResponse = {
    token: string
    userId: number
    username: string
    email: string
}

// ─── Users ────────────────────────────────────────────────────────────
export type UserSearchItem = {
    id: number
    username: string
    firstName: string
    lastName: string
}

export type MyProfileResponse = {
    id: number
    username: string
    firstName: string
    lastName: string
}

export type QrDataResponse = {
    userId: number
    displayName: string
    payload: string
}

// ─── Wallet ───────────────────────────────────────────────────────────
export type WalletResponse = {
    id: number
    balance: number
    user: SimpleUser
}

export type TopUpInitiateResponse = {
    intentId: number
    redirectUrl: string
    fields: Record<string, unknown>
}

// ─── Payments ─────────────────────────────────────────────────────────
export type SendPaymentRequest = {
    toUserId: number
    amount: number
    note?: string
}

export type SendPaymentResponse = {
    transactionId: number
    to: SimpleUser
    amount: number
    note: string | null
    timestamp: string
}

export type SplitPaymentRequest = {
    totalAmount: number
    reference: string
    participantUserIds: number[]
}

export type SplitPaymentResponse = {
    message: string
    reference: string
    totalAmount: number
    totalCount: number
    participantUserIds: number[]
}

export type MoneyRequestRequest = {
    toUserId: number
    amount: number
    note?: string
}

export type MoneyRequestResponse = {
    requestId: number
    from: SimpleUser
    to: SimpleUser
    amount: number
    note: string | null
    status: string
    createdAt: string
}

export type QrLinkRequest = {
    amount?: number
    note?: string
}

export type QrLinkResponse = {
    token: string
    qrPayload: string
    amount: number
    note: string | null
    expiresAt: string
}

export type QrLinkResolveResponse = {
    to: SimpleUser
    amount: number
    note: string | null
    expiresAt: string
    expired: boolean
}

// ─── Debts ────────────────────────────────────────────────────────────
export type DebtItem = {
    debtId: number
    amount: number
    reference: string
    toUserFirstName: string
    toUserEmail: string
    createdAt: string
}

export type SettleDebtRequest = {
    debtId: number
}

// ─── Friends ──────────────────────────────────────────────────────────
export type FriendItem = {
    id: number
    username: string
    firstName: string
    lastName: string
}

export type FriendRequestCreateRequest = {
    receiverId: number
}

export type FriendRequestItem = {
    id: number
    senderId: number
    senderUsername: string
    senderFirstName: string
    status: string
    createdAt: string
}

export type FriendRequestRespondRequest = {
    requestId: number
    action: 'ACCEPTED' | 'REJECTED'
}

// ─── History ──────────────────────────────────────────────────────────
export type TransactionDto = {
    id: number
    fromUser: SimpleUser | null
    toUser: SimpleUser | null
    amount: number
    type: 'SEND' | 'SPLIT' | 'TOP_UP' | 'SETTLE' | 'WITHDRAW'
    note: string | null
    reference: string | null
    splitGroupId: string | null
    timestamp: string
    direction: 'SENT' | 'RECEIVED' | null
}
