import { useState } from 'react'
import { useNavigate, NavLink, Navigate } from 'react-router-dom'
import type { RegisterRequest } from '@/features/auth/api.ts'
import { cn } from '@/lib/utils'
import { register } from '@/features/auth/api.ts'
import { startSession } from '@/features/auth/session.ts'
import { getStoredUser } from '@/features/auth/sessionState.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradientText } from '@/components/GradientText'

type SignupForm = RegisterRequest & { confirmPassword: string }

export default function SignupPage() {
    const navigate = useNavigate()
    const alreadyAuthed = !!getStoredUser()

    const [role, setRole] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL')
    const [form, setForm] = useState<SignupForm>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        businessCategory: '',
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
                password: form.password,
                role,
                ...(role === 'BUSINESS' && {
                    businessName: form.businessName,
                    businessCategory: form.businessCategory,
                }),
            }

            const res = await register(payload)
            startSession(res)
            navigate('/dashboard')
        } catch {
            setError('Signup failed. Please verify your details and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (alreadyAuthed) return <Navigate to="/dashboard" replace />

    return (
        <div className="space-y-6">
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                <p className="text-sm text-muted-foreground">
                    Get started with <GradientText>Blink Pay</GradientText> today
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                {/* Account type toggle */}
                <div className="flex gap-1 p-1 rounded-full bg-secondary/60">
                    {(['PERSONAL', 'BUSINESS'] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={cn(
                                'flex-1 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer border-0',
                                r === role
                                    ? 'bg-[#00D4B8] text-[#09090B] shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {r === 'PERSONAL' ? 'Personal' : 'Business'}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                        <Input
                            id="firstName"
                            value={form.firstName}
                            onChange={(e) => set('firstName', e.target.value)}
                            autoComplete="given-name"
                            required
                            className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                        <Input
                            id="lastName"
                            value={form.lastName}
                            onChange={(e) => set('lastName', e.target.value)}
                            autoComplete="family-name"
                            required
                            className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">Username</Label>
                    <Input
                        id="username"
                        value={form.username}
                        onChange={(e) => set('username', e.target.value)}
                        autoComplete="username"
                        required
                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                    />
                </div>

                {role === 'BUSINESS' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="businessName" className="text-foreground">Business Name</Label>
                            <Input
                                id="businessName"
                                value={form.businessName ?? ''}
                                onChange={(e) => set('businessName', e.target.value)}
                                required={role === 'BUSINESS'}
                                placeholder="Acme Corp"
                                className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessCategory" className="text-foreground">Category</Label>
                            <Input
                                id="businessCategory"
                                value={form.businessCategory ?? ''}
                                onChange={(e) => set('businessCategory', e.target.value)}
                                placeholder="e.g. Retail"
                                className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                        id="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        type="email"
                        autoComplete="email"
                        required
                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <Input
                        id="password"
                        value={form.password}
                        onChange={(e) => set('password', e.target.value)}
                        type="password"
                        autoComplete="new-password"
                        required
                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        value={form.confirmPassword}
                        onChange={(e) => set('confirmPassword', e.target.value)}
                        type="password"
                        autoComplete="new-password"
                        required
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
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <NavLink to="/login" className="text-[#00D4B8] hover:underline font-medium no-underline">
                    Sign in
                </NavLink>
            </p>
        </div>
    )
}
