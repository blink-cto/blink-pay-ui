import { useState } from 'react'
import { searchUsers } from '../../../shared/api/users'
import { sendPayment } from '../../../shared/api/payments'
import type { UserSearchItem } from '../../../shared/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function InstantPayPanel() {
    // Recipient search
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserSearchItem[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [recipient, setRecipient] = useState<UserSearchItem | null>(null)

    // Payment form
    const [amount, setAmount] = useState<number>(0)
    const [note, setNote] = useState('')

    // Submit
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)
    const [err, setErr] = useState<string | null>(null)

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

    return (
        <div className="grid gap-5">
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Instant Pay</h2>
                <p className="text-sm text-muted-foreground">Send money directly to another user's wallet.</p>
            </div>

            {(msg || err) && (
                <div className={`rounded-lg border px-4 py-3 text-sm ${
                    err
                        ? 'border-destructive/30 bg-destructive/10 text-destructive'
                        : 'border-[#00D4B8]/30 bg-[#00D4B8]/10 text-[#00D4B8]'
                }`}>
                    {err ?? msg}
                </div>
            )}

            {/* Recipient search */}
            <section className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Find recipient</h3>

                {recipient ? (
                    <div className="flex items-center justify-between bg-secondary/50 border border-[#00D4B8]/30 rounded-lg p-3">
                        <div>
                            <div className="font-semibold text-foreground text-sm">
                                {recipient.firstName} {recipient.lastName}{' '}
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
                                        {u.firstName} {u.lastName}{' '}
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

            {/* Payment form */}
            <section className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">Payment details</h3>

                <div className="grid grid-cols-2 gap-4">
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
                    {submitting ? 'Sending…' : `Send${recipient ? ` to ${recipient.firstName}` : ''}`}
                </Button>
            </section>
        </div>
    )
}
