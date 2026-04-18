import { useEffect, useState } from 'react'
import { getMyWallet, initiateTopUp } from '../../../shared/api/wallet'
import type { WalletResponse } from '../../../shared/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function WalletPanel() {
    const [wallet, setWallet] = useState<WalletResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [topUpAmount, setTopUpAmount] = useState<number>(100)
    const [topUpLoading, setTopUpLoading] = useState(false)
    const [topUpError, setTopUpError] = useState<string | null>(null)

    async function load() {
        setError(null)
        setLoading(true)
        try {
            const res = await getMyWallet()
            setWallet(res)
        } catch {
            setError('Failed to load wallet.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { void load() }, [])

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
            {/* Balance */}
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Wallet</h2>
                <div className="text-sm text-muted-foreground mb-1">Current balance</div>
                <div className="text-4xl font-bold text-[#00D4B8]">
                    R {wallet?.balance ?? 0}
                </div>
            </div>

            {/* Top Up */}
            <div className="border-t border-border pt-5">
                <h3 className="text-base font-semibold text-foreground mb-4">Top Up</h3>

                <div className="flex gap-3 items-end">
                    <div className="space-y-2">
                        <Label className="text-foreground">Amount (ZAR)</Label>
                        <Input
                            type="number"
                            min={1}
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(Number(e.target.value))}
                            className="w-36 bg-secondary border-input text-foreground focus-visible:ring-[#00D4B8]"
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
        </div>
    )
}
