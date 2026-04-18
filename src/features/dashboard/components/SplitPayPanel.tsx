import { useState } from 'react'
import { searchUsers } from '../../../shared/api/users'
import { splitPayment } from '../../../shared/api/payments'
import type { SplitPaymentRequest, UserSearchItem } from '../../../shared/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SplitPayPanel() {
    const [totalAmount, setTotalAmount] = useState<number>(100)
    const [reference, setReference] = useState<string>('')
    const [participants, setParticipants] = useState<UserSearchItem[]>([])

    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserSearchItem[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)

    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)
    const [err, setErr] = useState<string | null>(null)

    async function onSearch() {
        setMsg(null); setErr(null); setSearchError(null)
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

    function addParticipant(u: UserSearchItem) {
        if (participants.some((p) => p.id === u.id)) return
        setParticipants((prev) => [...prev, u])
    }

    function removeParticipant(id: number) {
        setParticipants((prev) => prev.filter((p) => p.id !== id))
    }

    async function onSubmit() {
        setMsg(null); setErr(null)
        if (!totalAmount || totalAmount <= 0) { setErr('Total amount must be greater than 0.'); return }
        if (participants.length === 0) { setErr('Please add at least 1 participant.'); return }

        const payload: SplitPaymentRequest = {
            totalAmount,
            reference: reference.trim(),
            participantUserIds: participants.map((p) => p.id)
        }

        setSubmitting(true)
        try {
            const res = await splitPayment(payload)
            setMsg(res.message || 'Split created.')
            setParticipants([])
            setReference('')
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'Split payment failed.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="grid gap-5">
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Split Pay</h2>
                <p className="text-sm text-muted-foreground">Create a split between selected participants.</p>
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

            {/* Split details */}
            <section className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">Split details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-foreground">Total Amount (ZAR)</Label>
                        <Input
                            type="number"
                            min={1}
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(Number(e.target.value))}
                            className="bg-secondary border-input text-foreground focus-visible:ring-[#00D4B8]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-foreground">
                            Reference <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="e.g. Dinner at Tashas"
                            className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <div className="text-sm font-semibold text-foreground mb-2">Participants</div>
                    {participants.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No participants added yet.</div>
                    ) : (
                        <div className="flex gap-2 flex-wrap">
                            {participants.map((p) => (
                                <span key={p.id} className="flex items-center gap-2 border border-border rounded-full px-3 py-1.5 text-sm bg-secondary text-foreground">
                                    {p.firstName} {p.lastName}
                                    <span className="text-muted-foreground">@{p.username}</span>
                                    <button
                                        onClick={() => removeParticipant(p.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    onClick={onSubmit}
                    disabled={submitting}
                    className="mt-4 bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer"
                >
                    {submitting ? 'Creating…' : 'Create Split'}
                </Button>
            </section>

            {/* User search */}
            <section className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Find users to add</h3>

                <div className="flex gap-3">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
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
                            <div>
                                <div className="font-semibold text-foreground text-sm">
                                    {u.firstName} {u.lastName}{' '}
                                    <span className="text-muted-foreground font-normal">@{u.username}</span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => addParticipant(u)}
                                variant="outline"
                                className="border-[#00D4B8]/40 text-[#00D4B8] hover:bg-[#00D4B8]/10 shrink-0 cursor-pointer"
                            >
                                Add
                            </Button>
                        </div>
                    ))}
                    {!searchLoading && query.trim() && results.length === 0 && (
                        <div className="text-sm text-muted-foreground">No users found.</div>
                    )}
                </div>
            </section>
        </div>
    )
}
