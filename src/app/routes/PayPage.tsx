import { useEffect, useState } from 'react'
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom'
import { getStoredUser } from '@/features/auth/sessionState.ts'
import { resolveQrLink, sendPayment } from '@/shared/api/payments'
import type { QrLinkResolveResponse } from '@/shared/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type State = 'loading' | 'expired' | 'error' | 'ready' | 'paying' | 'paid'

export default function PayPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token') ?? ''
    const authed = !!getStoredUser()

    const [state, setState] = useState<State>(() => token ? 'loading' : 'error')
    const [link, setLink] = useState<QrLinkResolveResponse | null>(null)
    const [amount, setAmount] = useState<number>(0)
    const [errMsg, setErrMsg] = useState<string | null>(() => token ? null : 'No payment token provided.')
    const [txId, setTxId] = useState<number | null>(null)

    useEffect(() => {
        if (!token) return

        resolveQrLink(token)
            .then((res) => {
                setLink(res)
                if (res.expired) {
                    setState('expired')
                } else {
                    setAmount(res.amount ?? 0)
                    setState('ready')
                }
            })
            .catch((e) => {
                setState('error')
                setErrMsg(e instanceof Error ? e.message : 'Failed to load payment link.')
            })
    }, [token])

    async function onPay() {
        if (!link) return
        if (!amount || amount <= 0) { setErrMsg('Enter an amount.'); return }
        setErrMsg(null)
        setState('paying')
        try {
            const res = await sendPayment({
                toUserId: link.to.id,
                amount,
                note: link.note ?? undefined,
            })
            setTxId(res.transactionId)
            setState('paid')
        } catch (e) {
            setErrMsg(e instanceof Error ? e.message : 'Payment failed.')
            setState('ready')
        }
    }

    if (!authed) return <Navigate to="/login" replace />

    const expiryStr = link
        ? new Date(link.expiresAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
        : ''

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm rounded-2xl bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_32px_rgba(0,0,0,0.4)] p-8 space-y-6">

                {state === 'loading' && (
                    <div className="space-y-4">
                        <div className="h-5 w-32 rounded bg-secondary animate-pulse mx-auto" />
                        <div className="h-12 rounded-lg bg-secondary animate-pulse" />
                        <div className="h-10 rounded-lg bg-secondary animate-pulse" />
                    </div>
                )}

                {state === 'error' && (
                    <div className="text-center space-y-3">
                        <div className="text-4xl">⚠️</div>
                        <h2 className="text-lg font-semibold text-foreground">Link not found</h2>
                        <p className="text-sm text-muted-foreground">{errMsg}</p>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            Go home
                        </Button>
                    </div>
                )}

                {state === 'expired' && (
                    <div className="text-center space-y-3">
                        <div className="text-4xl">⏱️</div>
                        <h2 className="text-lg font-semibold text-foreground">Link expired</h2>
                        <p className="text-sm text-muted-foreground">
                            This payment link expired on {expiryStr}. Ask the sender to generate a new one.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                            className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                )}

                {(state === 'ready' || state === 'paying') && link && (
                    <>
                        <div className="text-center space-y-1">
                            <p className="text-sm text-muted-foreground">You're paying</p>
                            <p className="text-2xl font-bold text-foreground">{link.to.firstName}</p>
                            <p className="text-sm text-muted-foreground">{link.to.email}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-foreground">
                                    Amount (ZAR)
                                    {link.amount === 0 && (
                                        <span className="text-muted-foreground font-normal ml-1">(set by payer)</span>
                                    )}
                                </Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={amount || ''}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    readOnly={link.amount > 0}
                                    placeholder="0.00"
                                    className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8] read-only:opacity-70"
                                />
                            </div>

                            {link.note && (
                                <div className="rounded-lg bg-secondary/50 border border-border px-4 py-3 text-sm text-muted-foreground">
                                    <span className="text-foreground font-medium">Note:</span> {link.note}
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground text-center">
                                Link expires {expiryStr}
                            </p>

                            {errMsg && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    {errMsg}
                                </div>
                            )}

                            <Button
                                onClick={onPay}
                                disabled={state === 'paying'}
                                className="w-full bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold h-11 shadow-md shadow-[#00D4B8]/20 cursor-pointer disabled:opacity-50"
                            >
                                {state === 'paying' ? 'Processing…' : `Pay R ${amount > 0 ? amount : '—'}`}
                            </Button>
                        </div>
                    </>
                )}

                {state === 'paid' && (
                    <div className="text-center space-y-3">
                        <div className="text-4xl">✅</div>
                        <h2 className="text-lg font-semibold text-foreground">Payment sent!</h2>
                        {txId && (
                            <p className="text-xs text-muted-foreground">Transaction #{txId}</p>
                        )}
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
