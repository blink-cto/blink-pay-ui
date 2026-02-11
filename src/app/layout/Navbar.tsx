import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import { endSession } from '../../features/auth/session'
import { getStoredUser } from '../../features/auth/sessionState'

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    color: isActive ? '#111' : '#555',
    fontWeight: isActive ? 600 : 400
})

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
        <header style={{ borderBottom: '1px solid #eee' }}>
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={logo} alt="Blink Pay" style={{ height: '32px' }} />
                        <strong>Blink Pay</strong>
                    </div>
                </NavLink>

                <nav style={{ display: 'flex', gap: '24px' }}>
                    <NavLink to="/" style={linkStyle} end>
                        Home
                    </NavLink>

                    <NavLink to="/about" style={linkStyle}>
                        About
                    </NavLink>

                    <NavLink to="/contact" style={linkStyle}>
                        Contact Us
                    </NavLink>
                </nav>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span style={{ color: '#555' }}>Hi, {user.firstName}</span>
                            <button
                                onClick={logout}
                                style={{ padding: '8px 12px', cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" style={linkStyle}>
                                Login
                            </NavLink>
                            <NavLink to="/signup" style={linkStyle}>
                                Sign Up
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
