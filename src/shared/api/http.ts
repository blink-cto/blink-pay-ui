import axios from 'axios'
import { getToken } from './token'
import type { ApiEnvelope } from '../types/api'

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
})

// Attach JWT to every request
http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Unwrap the { success, message, data } envelope.
// If success=false, throw so callers can catch a plain Error with the server message.
http.interceptors.response.use((response) => {
    const env = response.data as ApiEnvelope<unknown>
    if (env && typeof env === 'object' && 'success' in env) {
        if (!env.success) {
            return Promise.reject(new Error(env.message ?? 'Request failed'))
        }
        response.data = env.data
    }
    return response
})
