import { useEffect, useState } from 'react'
import { getMyWallet, initiateTopUp, directTopUp, cashOut } from '../../../shared/api/wallet'
import { getTransactionFeed } from '../../../shared/api/history'
import type { TransactionDto, WalletResponse } from '../../../shared/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const typeLabel: Record<TransactionDto['type'], string> = {
    SEND: 'Send',
    SPLIT: 'Split',
    TOP_UP: 'Top Up',
    SETTLE: 'Settle',
    WITHDRAW: 'Cashout',
}

export default function WalletPanel() {
    const [wallet, setWallet] = useState<WalletResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [recentTx, setRecentTx] = useState<TransactionDto[]>([])

    const [topUpAmount, setTopUpAmount] = useState<number>(100)
    const [topUpLoading, setTopUpLoading] = useState(false)
    const [topUpError, setTopUpError] = useState<string | null>(null)

    const [cashOutAmount, setCashOutAmount] = useState<number>(100)
    const [cashOutLoading, setCashOutLoading] = useState(false)
    const [cashOutError, setCashOutError] = useState<string | null>(null)
    const [cashOutMsg, setCashOutMsg] = useState<string | null>(null)

    const [directAmount, setDirectAmount] = useState<number>(500)
    const [directLoading, setDirectLoading] = useState(false)

    async function load() {
        setError(null)
        setLoading(true)
        try {
            const [walletRes, feedRes] = await Promise.all([
                getMyWallet(),
                getTransactionFeed(),
            ])
            setWallet(walletRes)
            setRecentTx(feedRes.slice(0, 3))
        } catch {
            setError('Failed to load wallet.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { void load() }, [])

    async function onCashOut() {
        setCashOutError(null); setCashOutMsg(null)
        setCashOutLoading(true)
        try {
            const res = await cashOut(cashOutAmount)
            setWallet(res)
            setCashOutMsg(`R ${cashOutAmount} cashout initiated. Funds arrive in 1–2 business days.`)
        } catch (e) {
            setCashOutError(e instanceof Error ? e.message : 'Cashout failed.')
        } finally {
            setCashOutLoading(false)
        }
    }

    async function onDirectTopUp() {
        setDirectLoading(true)
        try {
            const res = await directTopUp(directAmount)
            setWallet(res)
        } catch {
            // silently ignore — testing tool
        } finally {
            setDirectLoading(false)
        }
    }

    async function onTopUp() {
        setTopUpError(null)
        setTopUpLoading(true)
        try {
            const res = await initiateTopUp(topUpAmount.toFixed(2))
            window.location.href = res.redirectUrl
        } catch {
            setTopUpError('Failed to initiate top-up.')
        } finally {
            setTopUpLoading(false)
        }
    }

    if (loading) return <div className="text-muted-foreground">Loading wallet...</div>
    if (error) return <div className="text-destructive">{error}</div>

    return (
        <div className="grid gap-6">
            {/* Balance + last transaction */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">Wallet</h2>
                    <div className="text-xs text-muted-foreground mb-1">Current balance</div>
                    <div className="text-4xl font-bold text-[#00D4B8]">
                        R {wallet?.balance ?? 0}
                    </div>
                </div>

                {recentTx[0] && (() => {
                    const t = recentTx[0]
                    const isReceived = t.direction === 'RECEIVED' || t.type === 'TOP_UP'
                    const counterparty = isReceived ? t.fromUser : t.toUser
                    return (
                        <div className="shrink-0 border border-border/50 rounded-xl px-3 py-2.5 bg-secondary/30 text-right min-w-0">
                            <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Last transaction</div>
                            <div className={cn('text-sm font-semibold', isReceived ? 'text-[#00D4B8]' : 'text-[#FF2D78]')}>
                                {isReceived ? '+' : '−'} R {t.amount}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                                {typeLabel[t.type]}{counterparty ? ` · ${isReceived ? 'from' : 'to'} ${counterparty.firstName}` : ''}
                            </div>
                            <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                                {new Date(t.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    )
                })()}
            </div>

            {/* Top Up */}
            <div className="border-t border-border pt-5">
                <h3 className="text-base font-semibold text-foreground mb-4">Top Up</h3>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                    <div className="space-y-2">
                        <Label className="text-foreground">Amount (ZAR)</Label>
                        <Input
                            type="number"
                            min={1}
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(Number(e.target.value))}
                            className="w-full sm:w-36 bg-secondary border-input text-foreground focus-visible:ring-[#00D4B8]"
                        />
                    </div>

                    <Button
                        onClick={onTopUp}
                        disabled={topUpLoading}
                        className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer"
                    >
                        {topUpLoading ? 'Redirecting...' : 'Top Up via PayFast'}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={load}
                        className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        Refresh
                    </Button>
                </div>

                {topUpError && (
                    <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {topUpError}
                    </div>
                )}
            </div>

            {/* Cashout */}
            <div className="border-t border-border pt-5">
                <h3 className="text-base font-semibold text-foreground mb-1">Cashout</h3>
                <p className="text-xs text-muted-foreground mb-4">Withdraw funds to your bank account (1–2 business days).</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                    <div className="space-y-2">
                        <Label className="text-foreground">Amount (ZAR)</Label>
                        <Input
                            type="number"
                            min={1}
                            value={cashOutAmount}
                            onChange={(e) => setCashOutAmount(Number(e.target.value))}
                            className="w-full sm:w-36 bg-secondary border-input text-foreground focus-visible:ring-[#00D4B8]"
                        />
                    </div>
                    <Button
                        onClick={onCashOut}
                        disabled={cashOutLoading}
                        variant="outline"
                        className="border-[#FF2D78]/40 text-[#FF2D78] hover:bg-[#FF2D78]/10 font-semibold cursor-pointer"
                    >
                        {cashOutLoading ? 'Processing...' : 'Cashout'}
                    </Button>
                </div>

                {cashOutMsg && (
                    <div className="mt-3 rounded-lg border border-[#00D4B8]/30 bg-[#00D4B8]/10 px-4 py-3 text-sm text-[#00D4B8]">
                        {cashOutMsg}
                    </div>
                )}
                {cashOutError && (
                    <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {cashOutError}
                    </div>
                )}
            </div>

            {/* Direct Top-Up — testing only */}
            <div className="border-t border-border pt-5">
                <h3 className="text-base font-semibold text-foreground mb-1">
                    Quick Add{' '}
                    <span className="text-xs font-normal text-muted-foreground">(testing only)</span>
                </h3>
                <p className="text-xs text-muted-foreground mb-4">Instantly add funds without PayFast.</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                    <div className="space-y-2">
                        <Label className="text-foreground">Amount (ZAR)</Label>
                        <Input
                            type="number"
                            min={1}
                            value={directAmount}
                            onChange={(e) => setDirectAmount(Number(e.target.value))}
                            className="w-full sm:w-36 bg-secondary border-input text-foreground focus-visible:ring-[#00D4B8]"
                        />
                    </div>
                    <Button
                        onClick={onDirectTopUp}
                        disabled={directLoading}
                        className="bg-[#9B6DFF] text-white hover:bg-[#8B5CF6] font-semibold cursor-pointer"
                    >
                        {directLoading ? 'Adding...' : 'Add Funds'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
