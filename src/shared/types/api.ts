// Shared DTOs/contracts used by the UI (mirrors backend payloads)

export type AuthResponse = {
    token: string
    firstName: string
    email: string
}

export type WalletResponse = {
    id: number
    balance: number
}

export type TopUpInitiateResponse = {
    redirectUrl: string
}

// Users
export type UserSearchItem = {
    userId: number
    username: string
    firstName: string
    lastName: string
}

export type MyProfileResponse = {
    userId: number
    username: string
    firstName: string
    lastName: string
    email: string
}

// Split payment
export type SplitPaymentRequest = {
    totalAmount: number
    reference: string
    participantUserIds: number[]
}

export type SplitPaymentResponse = {
    success: boolean
    splitId?: number
    message?: string
}

// Debts
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

export type BasicActionResponse = {
    success: boolean
    message?: string
}

// Friends
export type FriendRequestCreateRequest = {
    receiverId: number
}

export type FriendRequestItem = {
    requestId: number
    senderId: number
    senderFirstName: string
    senderEmail: string
    createdAt: string
}

export type FriendRequestRespondRequest = {
    requestId: number
    action: 'ACCEPTED' | 'REJECTED'
}

// History
export type TransactionHistoryItem = {
    id: number
    amount: number
    reference: string
    direction: 'INWARD' | 'OUTWARD'
    type: string
    timestamp: string
}
