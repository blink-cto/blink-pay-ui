import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import { endSession } from '@/features/auth/session.ts'
import { getStoredUser } from '@/features/auth/sessionState.ts'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        'relative text-sm font-medium transition-colors duration-200 no-underline pb-1',
        isActive
            ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-[#00D4B8]'
            : 'text-muted-foreground hover:text-foreground'
    )

export default function Navbar() {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const onDashboard = pathname.startsWith('/dashboard')
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
        <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg shadow-[0_1px_0_0_rgba(255,255,255,0.04)]">
            <div className="max-w-screen-xl mx-auto px-8 py-5 grid grid-cols-3 items-center">
                <NavLink to="/" className="flex items-center gap-3 text-foreground no-underline">
                    <img src={logo} alt="Blink Pay" className="h-10 w-auto" />
                    <span className="font-bold text-xl tracking-tight">Blink Pay</span>
                </NavLink>

                <nav className="flex items-center justify-center gap-8">
                    <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                    <NavLink to="/about" className={navLinkClass}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                </nav>

                <div className="flex items-center justify-end gap-3">
                    {user ? (
                        <>
                            <span className="text-sm text-muted-foreground">
                                Hi, <span className="text-foreground font-medium">{user.username}</span>
                            </span>
                            {onDashboard ? (
                                <span className="relative inline-flex items-center h-9 px-4 text-sm font-semibold text-foreground after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:rounded-full after:bg-[#00D4B8]">
                                    Dashboard
                                </span>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer h-9 px-4 shadow-md shadow-[#00D4B8]/20"
                                >
                                    Dashboard
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                className="border-white/10 text-foreground hover:bg-white/5 cursor-pointer h-9 px-4"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground cursor-pointer h-9 px-4">
                                    Login
                                </Button>
                            </NavLink>
                            <NavLink to="/signup">
                                <Button size="sm" className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer h-9 px-5 shadow-lg shadow-[#00D4B8]/20">
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
