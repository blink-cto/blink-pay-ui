import type { AuthResponse } from '../../shared/types/api'
import { clearToken, setToken } from '../../shared/api/token'

const USER_KEY = 'blinkpay_user'

export function startSession(auth: AuthResponse): void {
    setToken(auth.token)
    localStorage.setItem(USER_KEY, JSON.stringify({ username: auth.username ?? auth.email, email: auth.email }))
    window.dispatchEvent(new Event('auth:changed'))
}

export function endSession(): void {
    clearToken()
    localStorage.removeItem(USER_KEY)
    window.dispatchEvent(new Event('auth:changed'))
}
