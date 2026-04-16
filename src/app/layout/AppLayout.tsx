import type { ReactNode } from 'react'
import Navbar from './Navbar'

type Props = {
    children: ReactNode
}

export default function AppLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
