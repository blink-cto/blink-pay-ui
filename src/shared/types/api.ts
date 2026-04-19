// Shared DTOs — mirrors the backend API contract

// ─── Envelope ────────────────────────────────────────────────────────
export type ApiEnvelope<T> = {
    success: boolean
    message: string | null
    data: T | null
}

// ─── Common ──────────────────────────────────────────────────────────
export type UserRole = 'PERSONAL' | 'BUSINESS'

// Minimal user shape returned inline on payments, history, wallet, and QR resolve
export type SimpleUser = {
    id: number
    firstName: string
    email: string
}

// Full profile returned by /users/me, /users/search, and friend endpoints
export type UserProfile = {
    id: number          // normalised from userId on the backend
    username: string
    firstName: string
    lastName: string
    role: UserRole
    phoneNumber: string | null
    profilePictureUrl: string | null
    businessName: string | null
    businessCategory: string | null
}

// Both aliases point to the same shape after normalisation
export type UserSearchItem = UserProfile
export type MyProfileResponse = UserProfile

export type QrDataResponse = {
    userId: number
    displayName: string
    payload: string
}

// ─── Auth ─────────────────────────────────────────────────────────────
export type AuthResponse = {
    token: string
    userId: number
    username: string
    email: string
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
    counterpartyId: number
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
    requestId: number
    senderId: number
    senderUsername: string
    senderFirstName: string
    senderLastName: string
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
