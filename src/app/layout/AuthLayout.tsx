import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
    children: ReactNode
}

export default function AuthLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border">
                <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
                    <NavLink to="/" className="flex items-center gap-3 text-foreground no-underline">
                        <img src={logo} alt="Blink Pay" className="h-8 w-auto" />
                        <span className="font-bold text-lg tracking-tight">Blink Pay</span>
                    </NavLink>
                    <NavLink to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">
                        Back to Home
                    </NavLink>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <Card className="w-full max-w-md bg-card border-border shadow-2xl">
                    <CardContent className="pt-6">
                        {children}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
