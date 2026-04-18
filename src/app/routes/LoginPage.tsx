import { useState } from 'react'
import { useNavigate, NavLink, Navigate } from 'react-router-dom'
import type { LoginRequest } from '@/features/auth/api.ts'
import { login } from '@/features/auth/api.ts'
import { startSession } from '@/features/auth/session.ts'
import { getStoredUser } from '@/features/auth/sessionState.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradientText } from '@/components/GradientText'

export default function LoginPage() {
    const navigate = useNavigate()

    if (getStoredUser()) return <Navigate to="/dashboard" replace />

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
        } catch {
            setError('Login failed. Please check your username and password.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to your <GradientText>Blink Pay</GradientText> account
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                        id="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <Input
                        id="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                    />
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold h-11 shadow-md shadow-[#00D4B8]/20 cursor-pointer"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <NavLink to="/signup" className="text-[#00D4B8] hover:underline font-medium no-underline">
                    Sign up
                </NavLink>
            </p>
        </div>
    )
}
