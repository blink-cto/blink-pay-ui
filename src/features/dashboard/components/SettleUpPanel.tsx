import { useEffect, useState } from 'react'
import { getMyDebts } from '../../../shared/api/debts'
import { settleDebt } from '../../../shared/api/payments'
import type { DebtItem } from '../../../shared/types/api'

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
            const res = await getMyDebts()
            setDebts(res)
        } catch {
            setError('Failed to load debts.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void load()
    }, [])

    async function onSettle(debtId: number) {
        setActionError(null)
        setSettlingId(debtId)
        try {
            const res = await settleDebt({ debtId })
            if (!res.success) {
                setActionError(res.message || 'Settle failed.')
                return
            }
            // refresh list after settle
            await load()
        } catch {
            setActionError('Settle failed.')
        } finally {
            setSettlingId(null)
        }
    }

    if (loading) return <div>Loading debts...</div>
    if (error) return <div>{error}</div>

    return (
        <div style={{ display: 'grid', gap: '12px' }}>
            <div>
                <h2 style={{ marginTop: 0 }}>Settle Up</h2>
                <p style={{ margin: 0, color: '#555' }}>
                    Outstanding debts you can settle.
                </p>
            </div>

            {actionError && (
                <div style={{ padding: '10px', border: '1px solid #f2caca' }}>
                    {actionError}
                </div>
            )}

            {debts.length === 0 ? (
                <div style={{ padding: '12px', border: '1px solid #eee' }}>
                    No outstanding debts 🎉
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                    {debts.map((d) => (
                        <div
                            key={d.debtId}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '12px',
                                padding: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <div style={{ display: 'grid', gap: '4px' }}>
                                <div style={{ fontWeight: 600 }}>
                                    Owe {d.toUserFirstName} ({d.toUserEmail})
                                </div>
                                <div style={{ color: '#555' }}>
                                    {d.reference || 'No reference'} • {new Date(d.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ fontWeight: 700 }}>R {d.amount}</div>
                                <button
                                    onClick={() => onSettle(d.debtId)}
                                    disabled={settlingId === d.debtId}
                                    style={{ padding: '10px 14px', cursor: 'pointer' }}
                                >
                                    {settlingId === d.debtId ? 'Settling...' : 'Settle'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <button onClick={load} style={{ padding: '10px 14px', cursor: 'pointer' }}>
                    Refresh
                </button>
            </div>
        </div>
    )
}
