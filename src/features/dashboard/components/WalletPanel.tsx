import { useEffect, useState } from 'react'
import { getMyWallet, initiateTopUp } from '../../../shared/api/wallet'
import type { WalletResponse } from '../../../shared/types/api'

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

    useEffect(() => {
        void load()
    }, [])

    async function onTopUp() {
        setTopUpError(null)
        setTopUpLoading(true)
        try {
            const res = await initiateTopUp(topUpAmount)
            // PayFast flow: redirect browser
            window.location.href = res.redirectUrl
        } catch {
            setTopUpError('Failed to initiate top-up.')
        } finally {
            setTopUpLoading(false)
        }
    }

    if (loading) return <div>Loading wallet...</div>
    if (error) return <div>{error}</div>

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            <div>
                <h2 style={{ marginTop: 0 }}>Wallet</h2>
                <div style={{ color: '#555' }}>Current balance</div>
                <div style={{ fontSize: '32px', fontWeight: 700 }}>
                    R {wallet?.balance ?? 0}
                </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
                <h3 style={{ margin: 0 }}>Top Up</h3>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
                    <input
                        type="number"
                        min={1}
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(Number(e.target.value))}
                        style={{ padding: '10px', width: '140px' }}
                    />

                    <button
                        onClick={onTopUp}
                        disabled={topUpLoading}
                        style={{ padding: '10px 14px', cursor: 'pointer' }}
                    >
                        {topUpLoading ? 'Redirecting...' : 'Top Up via PayFast'}
                    </button>

                    <button
                        onClick={load}
                        style={{ padding: '10px 14px', cursor: 'pointer' }}
                    >
                        Refresh
                    </button>
                </div>

                {topUpError && (
                    <div style={{ marginTop: '12px', padding: '10px', border: '1px solid #f2caca' }}>
                        {topUpError}
                    </div>
                )}
            </div>
        </div>
    )
}
