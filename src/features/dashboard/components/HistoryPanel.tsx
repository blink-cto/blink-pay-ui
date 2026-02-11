import { useEffect, useState } from 'react'
import { getInwardHistory, getOutwardHistory } from '../../../shared/api/history'
import type { TransactionHistoryItem } from '../../../shared/types/api'

export default function HistoryPanel() {
    const [inward, setInward] = useState<TransactionHistoryItem[]>([])
    const [outward, setOutward] = useState<TransactionHistoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function load() {
        setError(null)
        setLoading(true)
        try {
            const [inRes, outRes] = await Promise.all([
                getInwardHistory(),
                getOutwardHistory()
            ])
            setInward(inRes)
            setOutward(outRes)
        } catch {
            setError('Failed to load transaction history.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void load()
    }, [])

    if (loading) return <div>Loading history...</div>
    if (error) return <div>{error}</div>

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h2 style={{ marginTop: 0 }}>History</h2>
                    <div style={{ color: '#555' }}>Inward and outward transactions.</div>
                </div>

                <button onClick={load} style={{ padding: '10px 14px', cursor: 'pointer' }}>
                    Refresh
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Outward */}
                <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '12px' }}>
                    <h3 style={{ marginTop: 0 }}>Outward</h3>
                    {outward.length === 0 ? (
                        <div style={{ color: '#777' }}>No outward transactions yet.</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {outward.map((t) => (
                                <HistoryRow key={t.id} t={t} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Inward */}
                <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '12px' }}>
                    <h3 style={{ marginTop: 0 }}>Inward</h3>
                    {inward.length === 0 ? (
                        <div style={{ color: '#777' }}>No inward transactions yet.</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {inward.map((t) => (
                                <HistoryRow key={t.id} t={t} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function HistoryRow({ t }: { t: TransactionHistoryItem }) {
    return (
        <div
            style={{
                border: '1px solid #f2f2f2',
                borderRadius: '10px',
                padding: '10px',
                display: 'grid',
                gap: '4px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ fontWeight: 700 }}>R {t.amount}</div>
                <div style={{ color: '#777' }}>{new Date(t.timestamp).toLocaleString()}</div>
            </div>
            <div style={{ color: '#555' }}>
                {t.reference || 'No reference'}
            </div>
            <div style={{ color: '#777' }}>Type: {t.type}</div>
        </div>
    )
}
