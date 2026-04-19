import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
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

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        'text-base font-medium transition-colors duration-200 no-underline py-2.5 border-b border-border/30 last:border-0',
        isActive ? 'text-[#00D4B8]' : 'text-muted-foreground'
    )

export default function Navbar() {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const onDashboard = pathname.startsWith('/dashboard')
    const [user, setUser] = useState(() => getStoredUser())
    const [menuOpen, setMenuOpen] = useState(false)

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
            {/* ── Main row ───────────────────────────────────────────── */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between md:grid md:grid-cols-3">
                <NavLink to="/" className="flex items-center gap-2 sm:gap-3 text-foreground no-underline">
                    <img src={logo} alt="Blink Pay" className="h-8 sm:h-10 w-auto" />
                    <span className="blink-title font-bold text-lg sm:text-xl tracking-tight">Blink Pay</span>
                </NavLink>

                {/* Desktop nav links */}
                <nav className="hidden md:flex items-center justify-center gap-8">
                    <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                    <NavLink to="/about" className={navLinkClass}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                </nav>

                {/* Desktop auth */}
                <div className="hidden md:flex items-center justify-end gap-3">
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

                {/* Hamburger — mobile only */}
                <div className="flex md:hidden items-center justify-end">
                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-1"
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={menuOpen ? 'close' : 'open'}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.15 }}
                            >
                                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* ── Mobile user bar (always visible when logged in) ────── */}
            {user && (
                <div className="md:hidden px-4 pb-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        Signed in as{' '}
                        <span className="text-[#00D4B8] font-medium">{user.username}</span>
                    </span>
                    {!onDashboard && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0"
                        >
                            Dashboard →
                        </button>
                    )}
                </div>
            )}

            {/* ── Mobile dropdown ────────────────────────────────────── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-lg"
                    >
                        <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-col">
                            <NavLink to="/" className={mobileNavLinkClass} end onClick={() => setMenuOpen(false)}>Home</NavLink>
                            <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>About</NavLink>
                            <NavLink to="/contact" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Contact</NavLink>

                            <div className="pt-3 flex flex-col gap-2">
                                {user ? (
                                    <>
                                        {!onDashboard && (
                                            <Button
                                                onClick={() => { navigate('/dashboard'); setMenuOpen(false) }}
                                                className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer w-full"
                                            >
                                                Dashboard
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={() => { logout(); setMenuOpen(false) }}
                                            className="border-white/10 text-foreground hover:bg-white/5 cursor-pointer w-full"
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <NavLink to="/login" className="w-full" onClick={() => setMenuOpen(false)}>
                                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground cursor-pointer w-full">
                                                Login
                                            </Button>
                                        </NavLink>
                                        <NavLink to="/signup" className="w-full" onClick={() => setMenuOpen(false)}>
                                            <Button className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer w-full shadow-lg shadow-[#00D4B8]/20">
                                                Sign Up
                                            </Button>
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
