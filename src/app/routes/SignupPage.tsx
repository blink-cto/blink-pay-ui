import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import type { RegisterRequest } from '../../features/auth/api'
import { register } from '../../features/auth/api'
import { startSession } from '../../features/auth/session'

type SignupForm = RegisterRequest & { confirmPassword: string }

export default function SignupPage() {
    const navigate = useNavigate()

    const [form, setForm] = useState<SignupForm>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    function set<K extends keyof SignupForm>(key: K, value: SignupForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsSubmitting(true)

        try {
            const payload: RegisterRequest = {
                firstName: form.firstName,
                lastName: form.lastName,
                username: form.username,
                email: form.email,
                password: form.password
            }

            const res = await register(payload)
            startSession(res)
            navigate('/dashboard')
        } catch (err) {
            setError('Signup failed. Please verify your details and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <h1>Sign Up</h1>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '12px' }}>
                <label>
                    First Name
                    <input
                        value={form.firstName}
                        onChange={(e) => set('firstName', e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '6px' }}
                    />
                </label>

                <label>
                    Last Name
                    <input
                        value={form.lastName}
                        onChange={(e) => set('lastName', e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '6px' }}
                    />
                </label>

                <label>
                    Username
                    <input
                        value={form.username}
                        onChange={(e) => set('username', e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '6px' }}
                    />
                </label>

                <label>
                    Email
                    <input
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
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
                        onChange={(e) => set('password', e.target.value)}
                        type="password"
                        autoComplete="new-password"
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '6px' }}
                    />
                </label>

                <label>
                    Confirm Password
                    <input
                        value={form.confirmPassword}
                        onChange={(e) => set('confirmPassword', e.target.value)}
                        type="password"
                        autoComplete="new-password"
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
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            <p style={{ marginTop: '16px' }}>
                Already have an account? <NavLink to="/login">Login</NavLink>
            </p>
        </>
    )
}
