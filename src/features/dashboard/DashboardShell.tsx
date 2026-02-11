import { useMemo, useState } from 'react'
import { DASHBOARD_TABS, type DashboardTab } from './menu'
import InstantPayPanel from './components/InstantPayPanel'
import SplitPayPanel from './components/SplitPayPanel'
import WalletPanel from './components/WalletPanel'
import HistoryPanel from './components/HistoryPanel'
import FriendsPanel from './components/FriendsPanel'
import SettleUpPanel from './components/SettleUpPanel'

export default function DashboardShell() {
    const [active, setActive] = useState<DashboardTab>('instant')

    const ActivePanel = useMemo(() => {
        switch (active) {
            case 'instant':
                return <InstantPayPanel />
            case 'split':
                return <SplitPayPanel />
            case 'wallet':
                return <WalletPanel />
            case 'history':
                return <HistoryPanel />
            case 'friends':
                return <FriendsPanel />
            case 'settle':
                return <SettleUpPanel />
            default:
                return <InstantPayPanel />
        }
    }, [active])

    return (
        <div
            style={{
                height: 'calc(100vh - 73px)', // subtract navbar height (approx)
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
        >
            {/* Center menu */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '8px',
                        border: '1px solid #eee',
                        borderRadius: '999px'
                    }}
                >
                    {DASHBOARD_TABS.map((t) => {
                        const isActive = t.key === active
                        return (
                            <button
                                key={t.key}
                                onClick={() => setActive(t.key)}
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: '999px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: isActive ? '#111' : 'transparent',
                                    color: isActive ? '#fff' : '#555'
                                }}
                            >
                                {t.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Content panel */}
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    padding: '16px'
                }}
            >
                {ActivePanel}
            </div>
        </div>
    )
}
