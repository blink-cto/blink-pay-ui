import { useEffect, useState } from 'react'
import { getTransactionFeed } from '../../../shared/api/history'
import type { TransactionDto } from '../../../shared/types/api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const typeLabel: Record<TransactionDto['type'], string> = {
    SEND: 'Send',
    SPLIT: 'Split',
    TOP_UP: 'Top Up',
    SETTLE: 'Settle',
    WITHDRAW: 'Cashout',
}

export default function HistoryPanel() {
    const [feed, setFeed] = useState<TransactionDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function load() {
        setError(null)
        setLoading(true)
        try {
            setFeed(await getTransactionFeed())
        } catch {
            setError('Failed to load transaction history.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { void load() }, [])

    if (loading) return <div className="text-muted-foreground">Loading history...</div>
    if (error) return <div className="text-destructive">{error}</div>

    return (
        <div className="grid gap-5">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">History</h2>
                    <p className="text-sm text-muted-foreground">All transactions, newest first.</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={load}
                    className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                    Refresh
                </Button>
            </div>

            {feed.length === 0 ? (
                <div className="text-sm text-muted-foreground">No transactions yet.</div>
            ) : (
                <div className="grid gap-2">
                    {feed.map((t) => <TxRow key={t.id} t={t} />)}
                </div>
            )}
        </div>
    )
}

function TxRow({ t }: { t: TransactionDto }) {
    const isReceived = t.direction === 'RECEIVED' || t.type === 'TOP_UP'
    const counterparty = isReceived ? t.fromUser : t.toUser

    return (
        <div className="bg-secondary/50 border border-border rounded-lg p-3 flex justify-between items-center gap-3">
            <div className="grid gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        isReceived
                            ? 'bg-[#00D4B8]/10 text-[#00D4B8]'
                            : 'bg-[#FF2D78]/10 text-[#FF2D78]'
                    )}>
                        {typeLabel[t.type]}
                    </span>
                    {counterparty && (
                        <span className="text-sm text-foreground font-medium truncate">
                            {isReceived ? 'from' : 'to'} {counterparty.firstName}
                        </span>
                    )}
                </div>
                <div className="text-xs text-muted-foreground">
                    {t.note || t.reference || 'No note'} · {new Date(t.timestamp).toLocaleString()}
                </div>
            </div>

            <div className={cn('font-bold text-base shrink-0', isReceived ? 'text-[#00D4B8]' : 'text-[#FF2D78]')}>
                {isReceived ? '+' : '-'} R {t.amount}
            </div>
        </div>
    )
}
