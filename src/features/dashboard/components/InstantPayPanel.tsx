import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { searchUsers } from '../../../shared/api/users'
import { sendPayment, createQrLink, requestMoney, getSentRequests, cancelRequest } from '../../../shared/api/payments'
import type { MoneyRequestResponse, UserSearchItem, QrLinkResponse } from '../../../shared/types/api'
import { displayName } from '@/shared/utils/userDisplay'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Mode = 'send' | 'receive' | 'request'

export default function InstantPayPanel() {
    const [mode, setMode] = useState<Mode>('send')

    // ── Send state ────────────────────────────────────────────
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserSearchItem[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [recipient, setRecipient] = useState<UserSearchItem | null>(null)
    const [amount, setAmount] = useState<number>(0)
    const [note, setNote] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)
    const [err, setErr] = useState<string | null>(null)

    // ── Sent requests state ───────────────────────────────────
    const [sentRequests, setSentRequests] = useState<MoneyRequestResponse[]>([])
    const [sentLoading, setSentLoading] = useState(false)
    const [cancellingId, setCancellingId] = useState<number | null>(null)
    const [cancelMsg, setCancelMsg] = useState<string | null>(null)
    const [cancelErr, setCancelErr] = useState<string | null>(null)

    // ── Request state ─────────────────────────────────────────
    const [reqQuery, setReqQuery] = useState('')
    const [reqResults, setReqResults] = useState<UserSearchItem[]>([])
    const [reqSearchLoading, setReqSearchLoading] = useState(false)
    const [reqSearchError, setReqSearchError] = useState<string | null>(null)
    const [reqRecipient, setReqRecipient] = useState<UserSearchItem | null>(null)
    const [reqAmount, setReqAmount] = useState<number>(0)
    const [reqNote, setReqNote] = useState('')
    const [reqSubmitting, setReqSubmitting] = useState(false)
    const [reqMsg, setReqMsg] = useState<string | null>(null)
    const [reqErr, setReqErr] = useState<string | null>(null)

    // ── Receive / QR state ────────────────────────────────────
    const [qrAmount, setQrAmount] = useState<number>(0)
    const [qrNote, setQrNote] = useState('')
    const [generating, setGenerating] = useState(false)
    const [qrResult, setQrResult] = useState<QrLinkResponse | null>(null)
    const [genErr, setGenErr] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    // ── Send handlers ─────────────────────────────────────────
    async function onSearch() {
        setSearchError(null)
        const q = query.trim()
        if (!q) { setResults([]); return }
        setSearchLoading(true)
        try {
            setResults(await searchUsers(q))
        } catch {
            setSearchError('User search failed.')
        } finally {
            setSearchLoading(false)
        }
    }

    function selectRecipient(u: UserSearchItem) {
        setRecipient(u)
        setResults([])
        setQuery('')
        setMsg(null)
        setErr(null)
    }

    async function onSend() {
        setMsg(null); setErr(null)
        if (!recipient) { setErr('Please select a recipient.'); return }
        if (!amount || amount <= 0) { setErr('Amount must be greater than 0.'); return }

        setSubmitting(true)
        try {
            const res = await sendPayment({ toUserId: recipient.id, amount, note: note.trim() || undefined })
            setMsg(`Sent R ${res.amount} to ${res.to.firstName}. Transaction #${res.transactionId}`)
            setRecipient(null)
            setAmount(0)
            setNote('')
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Payment failed.')
        } finally {
            setSubmitting(false)
        }
    }

    // ── Request handlers ──────────────────────────────────────
    async function onReqSearch() {
        setReqSearchError(null)
        const q = reqQuery.trim()
        if (!q) { setReqResults([]); return }
        setReqSearchLoading(true)
        try {
            setReqResults(await searchUsers(q))
        } catch {
            setReqSearchError('User search failed.')
        } finally {
            setReqSearchLoading(false)
        }
    }

    function selectReqRecipient(u: UserSearchItem) {
        setReqRecipient(u)
        setReqResults([])
        setReqQuery('')
        setReqMsg(null)
        setReqErr(null)
    }

    async function onRequest() {
        setReqMsg(null); setReqErr(null)
        if (!reqRecipient) { setReqErr('Please select who to request from.'); return }
        if (!reqAmount || reqAmount <= 0) { setReqErr('Amount must be greater than 0.'); return }

        setReqSubmitting(true)
        try {
            const res = await requestMoney({ toUserId: reqRecipient.id, amount: reqAmount, note: reqNote.trim() || undefined })
            setReqMsg(`Request #${res.requestId} sent to ${displayName(reqRecipient)} for R ${res.amount}.`)
            setReqRecipient(null)
            setReqAmount(0)
            setReqNote('')
        } catch (e) {
            setReqErr(e instanceof Error ? e.message : 'Request failed.')
        } finally {
            setReqSubmitting(false)
        }
    }

    async function loadSentRequests() {
        setSentLoading(true)
        try {
            setSentRequests(await getSentRequests())
        } catch {
            // non-critical, fail silently
        } finally {
            setSentLoading(false)
        }
    }

    useEffect(() => {
        if (mode === 'request') void loadSentRequests()
    }, [mode])

    async function onCancel(requestId: number) {
        setCancelMsg(null); setCancelErr(null); setCancellingId(requestId)
        try {
            await cancelRequest(requestId)
            setCancelMsg('Request cancelled.')
            await loadSentRequests()
        } catch (e) {
            setCancelErr(e instanceof Error ? e.message : 'Cancel failed.')
        } finally {
            setCancellingId(null)
        }
    }

    // ── Receive / QR handlers ─────────────────────────────────
    async function onGenerateQr() {
        setGenErr(null)
        setGenerating(true)
        try {
            const res = await createQrLink({
                amount: qrAmount > 0 ? qrAmount : undefined,
                note: qrNote.trim() || undefined,
            })
            setQrResult(res)
        } catch (e) {
            setGenErr(e instanceof Error ? e.message : 'Failed to generate QR code.')
        } finally {
            setGenerating(false)
        }
    }

    function resetQr() {
        setQrResult(null)
        setGenErr(null)
        setQrAmount(0)
        setQrNote('')
        setCopied(false)
    }

    const payLink = qrResult
        ? `${window.location.origin}/pay?token=${qrResult.token}`
        : ''

    async function copyLink() {
        await navigator.clipboard.writeText(payLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const expiryStr = qrResult
        ? new Date(qrResult.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : ''

    return (
        <div className="grid gap-5">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">Instant Pay</h2>
                    <p className="text-sm text-muted-foreground">
                        {mode === 'send' ? "Send money directly to another user's wallet."
                            : mode === 'receive' ? 'Generate a QR link so someone can pay you.'
                            : 'Request money from another user.'}
                    </p>
                </div>

                {/* Send / Receive / Request toggle */}
                <div className="flex gap-1 p-1 rounded-full bg-secondary/60 shrink-0">
                    {(['send', 'receive', 'request'] as Mode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={cn(
                                'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer border-0',
                                m === mode
                                    ? 'bg-[#00D4B8] text-[#09090B] shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {m === 'send' ? 'Send' : m === 'receive' ? 'Receive' : 'Request'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── SEND VIEW ─────────────────────────────────────── */}
            {mode === 'send' && (
                <>
                    {(msg || err) && (
                        <div className={`rounded-lg border px-4 py-3 text-sm ${
                            err
                                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                                : 'border-[#00D4B8]/30 bg-[#00D4B8]/10 text-[#00D4B8]'
                        }`}>
                            {err ?? msg}
                        </div>
                    )}

                    <section className="border border-border rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Find recipient</h3>

                        {recipient ? (
                            <div className="flex items-center justify-between bg-secondary/50 border border-[#00D4B8]/30 rounded-lg p-3">
                                <div>
                                    <div className="font-semibold text-foreground text-sm">
                                        {displayName(recipient)}{' '}
                                        <span className="text-muted-foreground font-normal">@{recipient.username}</span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setRecipient(null)}
                                    className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    Change
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-3">
                                    <Input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                                        placeholder="Search by name or username"
                                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                    />
                                    <Button
                                        onClick={onSearch}
                                        disabled={searchLoading}
                                        className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold shrink-0 cursor-pointer"
                                    >
                                        {searchLoading ? 'Searching…' : 'Search'}
                                    </Button>
                                </div>

                                {searchError && (
                                    <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                        {searchError}
                                    </div>
                                )}

                                <div className="mt-3 grid gap-2">
                                    {results.map((u) => (
                                        <div key={u.id} className="bg-secondary/50 border border-border rounded-lg p-3 flex justify-between items-center gap-3">
                                            <div className="font-semibold text-foreground text-sm">
                                                {displayName(u)}{' '}
                                                <span className="text-muted-foreground font-normal">@{u.username}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => selectRecipient(u)}
                                                className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold shrink-0 cursor-pointer"
                                            >
                                                Select
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>

                    <section className="border border-border rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Payment details</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-foreground">Amount (ZAR)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={amount || ''}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    placeholder="0.00"
                                    className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">
                                    Note <span className="text-muted-foreground font-normal">(optional)</span>
                                </Label>
                                <Input
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="e.g. Lunch"
                                    className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={onSend}
                            disabled={submitting || !recipient}
                            className="mt-4 bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? 'Sending…' : `Send${recipient ? ` to ${displayName(recipient)}` : ''}`}
                        </Button>
                    </section>
                </>
            )}

            {/* ── REQUEST VIEW ──────────────────────────────────── */}
            {mode === 'request' && (
                <>
                    {(reqMsg || reqErr) && (
                        <div className={`rounded-lg border px-4 py-3 text-sm ${
                            reqErr
                                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                                : 'border-[#00D4B8]/30 bg-[#00D4B8]/10 text-[#00D4B8]'
                        }`}>
                            {reqErr ?? reqMsg}
                        </div>
                    )}

                    <section className="border border-border rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Request from</h3>

                        {reqRecipient ? (
                            <div className="flex items-center justify-between bg-secondary/50 border border-[#00D4B8]/30 rounded-lg p-3">
                                <div className="font-semibold text-foreground text-sm">
                                    {displayName(reqRecipient)}{' '}
                                    <span className="text-muted-foreground font-normal">@{reqRecipient.username}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setReqRecipient(null)}
                                    className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    Change
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-3">
                                    <Input
                                        value={reqQuery}
                                        onChange={(e) => setReqQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && onReqSearch()}
                                        placeholder="Search by name or username"
                                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                    />
                                    <Button
                                        onClick={onReqSearch}
                                        disabled={reqSearchLoading}
                                        className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold shrink-0 cursor-pointer"
                                    >
                                        {reqSearchLoading ? 'Searching…' : 'Search'}
                                    </Button>
                                </div>

                                {reqSearchError && (
                                    <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                        {reqSearchError}
                                    </div>
                                )}

                                <div className="mt-3 grid gap-2">
                                    {reqResults.map((u) => (
                                        <div key={u.id} className="bg-secondary/50 border border-border rounded-lg p-3 flex justify-between items-center gap-3">
                                            <div className="font-semibold text-foreground text-sm">
                                                {displayName(u)}{' '}
                                                <span className="text-muted-foreground font-normal">@{u.username}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => selectReqRecipient(u)}
                                                className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold shrink-0 cursor-pointer"
                                            >
                                                Select
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>

                    <section className="border border-border rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Request details</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-foreground">Amount (ZAR)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={reqAmount || ''}
                                    onChange={(e) => setReqAmount(Number(e.target.value))}
                                    placeholder="0.00"
                                    className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">
                                    Note <span className="text-muted-foreground font-normal">(optional)</span>
                                </Label>
                                <Input
                                    value={reqNote}
                                    onChange={(e) => setReqNote(e.target.value)}
                                    placeholder="e.g. Dinner"
                                    className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={onRequest}
                            disabled={reqSubmitting || !reqRecipient}
                            className="mt-4 bg-[#9B6DFF] text-white hover:bg-[#8B5CF6] font-semibold cursor-pointer disabled:opacity-50"
                        >
                            {reqSubmitting ? 'Requesting…' : `Request${reqRecipient ? ` from ${displayName(reqRecipient)}` : ''}`}
                        </Button>
                    </section>
                </>
            )}

            {/* ── SENT REQUESTS (inside Request view) ─────────── */}
            {mode === 'request' && (
                <section className="border border-border rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-foreground">Pending sent requests</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadSentRequests}
                            disabled={sentLoading}
                            className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            {sentLoading ? 'Loading…' : 'Refresh'}
                        </Button>
                    </div>

                    {(cancelMsg || cancelErr) && (
                        <div className={`mb-3 rounded-lg border px-4 py-3 text-sm ${
                            cancelErr
                                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                                : 'border-[#00D4B8]/30 bg-[#00D4B8]/10 text-[#00D4B8]'
                        }`}>
                            {cancelErr ?? cancelMsg}
                        </div>
                    )}

                    {sentRequests.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No pending requests.</div>
                    ) : (
                        <div className="grid gap-2">
                            {sentRequests.map((r) => (
                                <div key={r.requestId} className="bg-secondary/50 border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div className="grid gap-0.5">
                                        <div className="font-semibold text-foreground text-sm">
                                            Requested from {r.from.firstName}
                                            <span className="text-muted-foreground font-normal ml-1">({r.from.email})</span>
                                        </div>
                                        {r.note && <div className="text-xs text-muted-foreground">"{r.note}"</div>}
                                        <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="font-bold text-[#00D4B8]">R {r.amount}</div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onCancel(r.requestId)}
                                            disabled={cancellingId === r.requestId}
                                            className="border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
                                        >
                                            {cancellingId === r.requestId ? 'Cancelling…' : 'Cancel'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ── RECEIVE / QR VIEW ─────────────────────────────── */}
            {mode === 'receive' && (
                <>
                    {qrResult ? (
                        <div className="flex flex-col items-center gap-5">
                            {/* QR code */}
                            <div className="p-4 rounded-2xl bg-white shadow-lg">
                                <QRCodeSVG
                                    value={qrResult.qrPayload}
                                    size={200}
                                    bgColor="#ffffff"
                                    fgColor="#09090B"
                                    level="M"
                                />
                            </div>

                            {/* Details */}
                            <div className="text-center space-y-1">
                                {qrResult.amount > 0 && (
                                    <p className="text-2xl font-bold text-foreground">R {qrResult.amount}</p>
                                )}
                                {qrResult.note && (
                                    <p className="text-sm text-muted-foreground">"{qrResult.note}"</p>
                                )}
                                <p className="text-xs text-muted-foreground">Expires at {expiryStr}</p>
                            </div>

                            {/* Copyable link (for testing) */}
                            <div className="w-full max-w-sm space-y-2">
                                <p className="text-xs text-muted-foreground text-center">Or share this link</p>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={payLink}
                                        className="bg-secondary border-input text-foreground text-xs focus-visible:ring-[#00D4B8]"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={copyLink}
                                        className={cn(
                                            'shrink-0 font-semibold cursor-pointer transition-colors',
                                            copied
                                                ? 'bg-[#00D4B8]/20 text-[#00D4B8] border border-[#00D4B8]/30'
                                                : 'bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5]'
                                        )}
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                </div>
                            </div>

                            <button
                                onClick={resetQr}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0"
                            >
                                Generate a new one
                            </button>
                        </div>
                    ) : (
                        <section className="border border-border rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-4">QR payment link</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label className="text-foreground">
                                        Amount (ZAR) <span className="text-muted-foreground font-normal">(optional)</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={qrAmount || ''}
                                        onChange={(e) => setQrAmount(Number(e.target.value))}
                                        placeholder="Leave blank for open amount"
                                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">
                                        Note <span className="text-muted-foreground font-normal">(optional)</span>
                                    </Label>
                                    <Input
                                        value={qrNote}
                                        onChange={(e) => setQrNote(e.target.value)}
                                        placeholder="e.g. Rent"
                                        className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                    />
                                </div>
                            </div>

                            {genErr && (
                                <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    {genErr}
                                </div>
                            )}

                            <Button
                                onClick={onGenerateQr}
                                disabled={generating}
                                className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer disabled:opacity-50"
                            >
                                {generating ? 'Generating…' : 'Generate QR Code'}
                            </Button>
                        </section>
                    )}
                </>
            )}
        </div>
    )
}
