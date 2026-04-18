type StoredUser = { username: string; email: string }

const USER_KEY = 'blinkpay_user'

export function getStoredUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
        return JSON.parse(raw) as StoredUser
    } catch {
        return null
    }
}
