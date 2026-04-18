import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DASHBOARD_TABS, type DashboardTab } from './menu'
import InstantPayPanel from './components/InstantPayPanel'
import SplitPayPanel from './components/SplitPayPanel'
import WalletPanel from './components/WalletPanel'
import HistoryPanel from './components/HistoryPanel'
import FriendsPanel from './components/FriendsPanel'
import SettleUpPanel from './components/SettleUpPanel'
import { cn } from '@/lib/utils'

function renderPanel(tab: DashboardTab) {
    switch (tab) {
        case 'instant':  return <InstantPayPanel />
        case 'split':    return <SplitPayPanel />
        case 'wallet':   return <WalletPanel />
        case 'history':  return <HistoryPanel />
        case 'friends':  return <FriendsPanel />
        case 'settle':   return <SettleUpPanel />
    }
}

const TAB_KEY = 'blinkpay_active_tab'

export default function DashboardShell() {
    const [active, setActive] = useState<DashboardTab>(() => {
        const stored = sessionStorage.getItem(TAB_KEY) as DashboardTab | null
        return stored && DASHBOARD_TABS.some((t) => t.key === stored) ? stored : 'instant'
    })

    function handleTabChange(tab: DashboardTab) {
        setActive(tab)
        sessionStorage.setItem(TAB_KEY, tab)
    }

    return (
        <div className="flex flex-col gap-5" style={{ height: 'calc(100vh - 112px)' }}>
            {/* Tab bar */}
            <div className="flex justify-center">
                <div className="flex gap-1 p-1.5 rounded-full bg-card/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_16px_rgba(0,0,0,0.4)]">
                    {DASHBOARD_TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => handleTabChange(t.key)}
                            className={cn(
                                'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-0',
                                t.key === active
                                    ? 'bg-[#00D4B8] text-[#09090B] shadow-md shadow-[#00D4B8]/25'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Animated content panel */}
            <div className="flex-1 overflow-hidden rounded-2xl bg-card/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_24px_rgba(0,0,0,0.3)]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full overflow-y-auto p-5"
                    >
                        {renderPanel(active)}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
