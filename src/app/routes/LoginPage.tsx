import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import type { LoginRequest } from '../../features/auth/api'
import { login } from '../../features/auth/api'
import { startSession } from '../../features/auth/session'

export default function LoginPage() {
    const navigate = useNavigate()

    const [form, setForm] = useState<LoginRequest>({ email: '', password: '' })
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const res = await login(form)
            startSession(res)
            navigate('/dashboard')
        } catch (err) {
            setError('Login failed. Please check your email and password.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <h1>Login</h1>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '12px' }}>
                <label>
                    Email
                    <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        type="email"
                        autoComplete="email"
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '6px' }}
                    />
                </label>

                <label>
                    Password
                    <input
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        type="password"
                        autoComplete="current-password"
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '6px' }}
                    />
                </label>

                {error && (
                    <div style={{ padding: '10px', border: '1px solid #f2caca' }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ padding: '10px', cursor: 'pointer' }}
                >
                    {isSubmitting ? 'Signing in...' : 'Login'}
                </button>
            </form>

            <p style={{ marginTop: '16px' }}>
                Don’t have an account? <NavLink to="/signup">Sign up</NavLink>
            </p>
        </>
    )
}
