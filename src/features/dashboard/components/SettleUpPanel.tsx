import { useEffect, useState } from 'react'
import { getMyDebts, getMyRequests } from '../../../shared/api/debts'
import { settleDebt, declineRequest } from '../../../shared/api/payments'
import type { DebtItem } from '../../../shared/types/api'
import { Button } from '@/components/ui/button'

export default function SettleUpPanel() {
    const [debts, setDebts] = useState<DebtItem[]>([])
    const [debtsLoading, setDebtsLoading] = useState(true)
    const [debtsError, setDebtsError] = useState<string | null>(null)
    const [settlingId, setSettlingId] = useState<number | null>(null)
    const [debtsActionError, setDebtsActionError] = useState<string | null>(null)

    const [requests, setRequests] = useState<DebtItem[]>([])
    const [reqLoading, setReqLoading] = useState(true)
    const [reqError, setReqError] = useState<string | null>(null)
    const [reqBusyId, setReqBusyId] = useState<number | null>(null)
    const [reqActionMsg, setReqActionMsg] = useState<string | null>(null)
    const [reqActionErr, setReqActionErr] = useState<string | null>(null)

    async function loadDebts() {
        setDebtsError(null)
        setDebtsActionError(null)
        setDebtsLoading(true)
        try {
            setDebts(await getMyDebts())
        } catch {
            setDebtsError('Failed to load debts.')
        } finally {
            setDebtsLoading(false)
        }
    }

    async function loadRequests() {
        setReqError(null)
        setReqLoading(true)
        try {
            setRequests(await getMyRequests())
        } catch {
            setReqError('Failed to load money requests.')
        } finally {
            setReqLoading(false)
        }
    }

    function loadAll() {
        void loadDebts()
        void loadRequests()
    }

    useEffect(() => { loadAll() }, [])

    async function onSettle(debtId: number) {
        setDebtsActionError(null)
        setSettlingId(debtId)
        try {
            await settleDebt({ debtId })
            await loadDebts()
        } catch (e) {
            setDebtsActionError(e instanceof Error ? e.message : 'Settle failed.')
        } finally {
            setSettlingId(null)
        }
    }

    async function onPayRequest(debtId: number) {
        setReqActionMsg(null); setReqActionErr(null)
        setReqBusyId(debtId)
        try {
            await settleDebt({ debtId })
            setReqActionMsg('Payment sent.')
            await loadRequests()
        } catch (e) {
            setReqActionErr(e instanceof Error ? e.message : 'Payment failed.')
        } finally {
            setReqBusyId(null)
        }
    }

    async function onDeclineRequest(debtId: number) {
        setReqActionMsg(null); setReqActionErr(null)
        setReqBusyId(debtId)
        try {
            await declineRequest(debtId)
            setReqActionMsg('Request declined.')
            await loadRequests()
        } catch (e) {
            setReqActionErr(e instanceof Error ? e.message : 'Decline failed.')
        } finally {
            setReqBusyId(null)
        }
    }

    return (
        <div className="grid gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">Settle Up</h2>
                    <p className="text-sm text-muted-foreground">Outstanding debts and incoming money requests.</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={loadAll}
                    className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                    Refresh
                </Button>
            </div>

            {/* ── Split Debts ─────────────────────────────────────── */}
            <section className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Split debts</h3>

                {debtsActionError && (
                    <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {debtsActionError}
                    </div>
                )}

                {debtsLoading ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                ) : debtsError ? (
                    <div className="text-sm text-destructive">{debtsError}</div>
                ) : debts.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No outstanding split debts.</div>
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
            </section>

            {/* ── Incoming Money Requests ──────────────────────────── */}
            <section className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Incoming money requests</h3>

                {(reqActionMsg || reqActionErr) && (
                    <div className={`mb-3 rounded-lg border px-4 py-3 text-sm ${
                        reqActionErr
                            ? 'border-destructive/30 bg-destructive/10 text-destructive'
                            : 'border-[#00D4B8]/30 bg-[#00D4B8]/10 text-[#00D4B8]'
                    }`}>
                        {reqActionErr ?? reqActionMsg}
                    </div>
                )}

                {reqLoading ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                ) : reqError ? (
                    <div className="text-sm text-destructive">{reqError}</div>
                ) : requests.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No incoming requests.</div>
                ) : (
                    <div className="grid gap-3">
                        {requests.map((r) => (
                            <div key={r.debtId} className="border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-secondary/30">
                                <div className="grid gap-1 min-w-0">
                                    <div className="font-semibold text-foreground">
                                        {r.toUserFirstName} is requesting
                                        <span className="text-muted-foreground font-normal ml-1">({r.toUserEmail})</span>
                                    </div>
                                    {r.reference && (
                                        <div className="text-sm text-muted-foreground">"{r.reference}"</div>
                                    )}
                                    <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="font-bold text-lg text-[#FF2D78]">R {r.amount}</div>
                                    <Button
                                        size="sm"
                                        onClick={() => onPayRequest(r.debtId)}
                                        disabled={reqBusyId === r.debtId}
                                        className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer"
                                    >
                                        {reqBusyId === r.debtId ? '...' : 'Pay'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onDeclineRequest(r.debtId)}
                                        disabled={reqBusyId === r.debtId}
                                        className="border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
                                    >
                                        {reqBusyId === r.debtId ? '...' : 'Decline'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
