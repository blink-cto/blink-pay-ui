import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import { endSession } from '@/features/auth/session.ts'
import { getStoredUser } from '@/features/auth/sessionState.ts'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        'text-sm font-medium transition-colors duration-200 no-underline',
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    )

export default function Navbar() {
    const navigate = useNavigate()
    const [user, setUser] = useState(() => getStoredUser())

    useEffect(() => {
        const sync = () => setUser(getStoredUser())
        sync()
        window.addEventListener('storage', sync)
        window.addEventListener('auth:changed', sync)
        return () => {
            window.removeEventListener('storage', sync)
            window.removeEventListener('auth:changed', sync)
        }
    }, [])

    function logout() {
        endSession()
        setUser(null)
        navigate('/')
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-3 text-foreground no-underline">
                    <img src={logo} alt="Blink Pay" className="h-8 w-auto" />
                    <span className="font-bold text-lg tracking-tight">Blink Pay</span>
                </NavLink>

                <nav className="flex items-center gap-6">
                    <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                    <NavLink to="/about" className={navLinkClass}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <span className="text-sm text-muted-foreground">Hi, {user.firstName}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                className="border-border text-foreground hover:bg-secondary cursor-pointer"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground cursor-pointer">
                                    Login
                                </Button>
                            </NavLink>
                            <NavLink to="/signup">
                                <Button size="sm" className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer">
                                    Sign Up
                                </Button>
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
