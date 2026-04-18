import { useEffect, useState } from 'react'
import { getMyDebts } from '../../../shared/api/debts'
import { settleDebt } from '../../../shared/api/payments'
import type { DebtItem } from '../../../shared/types/api'
import { Button } from '@/components/ui/button'

export default function SettleUpPanel() {
    const [debts, setDebts] = useState<DebtItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [actionError, setActionError] = useState<string | null>(null)
    const [settlingId, setSettlingId] = useState<number | null>(null)

    async function load() {
        setError(null)
        setActionError(null)
        setLoading(true)
        try {
            setDebts(await getMyDebts())
        } catch {
            setError('Failed to load debts.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { void load() }, [])

    async function onSettle(debtId: number) {
        setActionError(null)
        setSettlingId(debtId)
        try {
            await settleDebt({ debtId })
            await load()
        } catch (e) {
            setActionError(e instanceof Error ? e.message : 'Settle failed.')
        } finally {
            setSettlingId(null)
        }
    }

    if (loading) return <div className="text-muted-foreground">Loading debts...</div>
    if (error) return <div className="text-destructive">{error}</div>

    return (
        <div className="grid gap-5">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">Settle Up</h2>
                    <p className="text-sm text-muted-foreground">Outstanding debts you can settle.</p>
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

            {actionError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {actionError}
                </div>
            )}

            {debts.length === 0 ? (
                <div className="border border-[#00D4B8]/20 bg-[#00D4B8]/5 rounded-xl p-6 text-center">
                    <div className="text-2xl mb-2">🎉</div>
                    <div className="text-foreground font-semibold">All clear!</div>
                    <div className="text-sm text-muted-foreground mt-1">No outstanding debts.</div>
                </div>
            ) : (
                <div className="grid gap-3">
                    {debts.map((d) => (
                        <div key={d.debtId} className="border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-secondary/30">
                            <div className="grid gap-1 min-w-0">
                                <div className="font-semibold text-foreground">
                                    Owe {d.toUserFirstName}
                                    <span className="text-muted-foreground font-normal ml-1">({d.toUserEmail})</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {d.reference || 'No reference'} · {new Date(d.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="font-bold text-lg text-[#FF2D78]">R {d.amount}</div>
                                <Button
                                    size="sm"
                                    onClick={() => onSettle(d.debtId)}
                                    disabled={settlingId === d.debtId}
                                    className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer"
                                >
                                    {settlingId === d.debtId ? 'Settling...' : 'Settle'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
