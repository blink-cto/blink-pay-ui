import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'

type Props = {
    children: ReactNode
}

export default function AuthLayout({ children }: Props) {
    return (
        <>
            <header
                style={{
                    borderBottom: '1px solid #eee'
                }}
            >
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
                    <NavLink
                        to="/"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={logo} alt="Blink Pay" style={{ height: '32px' }} />
                            <strong>Blink Pay</strong>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/"
                        style={{ textDecoration: 'none', color: '#555' }}
                    >
                        Back to Home
                    </NavLink>
                </div>
            </header>

            <main
                style={{
                    maxWidth: '420px',
                    margin: '80px auto',
                    padding: '0 24px'
                }}
            >
                {children}
            </main>
        </>
    )
}
