import { useState } from 'react'
import { searchUsers } from '../../../shared/api/users'
import { splitPayment } from '../../../shared/api/payments'
import type { SplitPaymentRequest, UserSearchItem } from '../../../shared/types/api'

export default function SplitPayPanel() {
    // Split form
    const [totalAmount, setTotalAmount] = useState<number>(100)
    const [reference, setReference] = useState<string>('')
    const [participants, setParticipants] = useState<UserSearchItem[]>([])

    // Search
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserSearchItem[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)

    // Submit
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)
    const [err, setErr] = useState<string | null>(null)

    async function onSearch() {
        setMsg(null)
        setErr(null)
        setSearchError(null)

        const q = query.trim()
        if (!q) {
            setResults([])
            return
        }

        setSearchLoading(true)
        try {
            const res = await searchUsers(q)
            setResults(res)
        } catch {
            setSearchError('User search failed.')
        } finally {
            setSearchLoading(false)
        }
    }

    function addParticipant(u: UserSearchItem) {
        if (participants.some((p) => p.userId === u.userId)) return
        setParticipants((prev) => [...prev, u])
    }

    function removeParticipant(userId: number) {
        setParticipants((prev) => prev.filter((p) => p.userId !== userId))
    }

    async function onSubmit() {
        setMsg(null)
        setErr(null)

        if (!totalAmount || totalAmount <= 0) {
            setErr('Total amount must be greater than 0.')
            return
        }
        if (participants.length === 0) {
            setErr('Please add at least 1 participant.')
            return
        }

        const payload: SplitPaymentRequest = {
            totalAmount,
            reference: reference.trim(),
            participantUserIds: participants.map((p) => p.userId)
        }

        setSubmitting(true)
        try {
            const res = await splitPayment(payload)
            if (!res.success) {
                setErr(res.message || 'Split payment failed.')
                return
            }
            setErr(null)
            setMsg(`Split created${res.splitId ? ` (ID: ${res.splitId})` : ''}.`)
            // update backend to send DTO, not participants and user details eventually:
            setParticipants([])
            setReference('')
        } catch {
            setErr('Split payment failed.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            <div>
                <h2 style={{ marginTop: 0 }}>Split Pay</h2>
                <div style={{ color: '#555' }}>Create a split between selected participants.</div>
            </div>

            {(msg || err) && (
                <div style={{ padding: '10px', border: `1px solid ${err ? '#f2caca' : '#cdeccd'}` }}>
                    {err ?? msg}
                </div>
            )}

            {/* Form */}
            <section style={{ border: '1px solid #eee', borderRadius: '12px', padding: '12px' }}>
                <h3 style={{ marginTop: 0 }}>Split details</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                    <label style={{ display: 'grid', gap: '6px' }}>
                        Total Amount
                        <input
                            type="number"
                            min={1}
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(Number(e.target.value))}
                            style={{ padding: '10px' }}
                        />
                    </label>

                    <label style={{ display: 'grid', gap: '6px' }}>
                        Reference (optional)
                        <input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="e.g. Dinner"
                            style={{ padding: '10px' }}
                        />
                    </label>
                </div>

                <div style={{ marginTop: '12px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>Participants</div>
                    {participants.length === 0 ? (
                        <div style={{ color: '#777' }}>No participants added yet.</div>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {participants.map((p) => (
                                <span
                                    key={p.userId}
                                    style={{
                                        border: '1px solid #eee',
                                        borderRadius: '999px',
                                        padding: '8px 10px',
                                        display: 'flex',
                                        gap: '8px',
                                        alignItems: 'center'
                                    }}
                                >
                  {p.firstName} {p.lastName} <span style={{ color: '#777' }}>@{p.username}</span>
                  <button
                      onClick={() => removeParticipant(p.userId)}
                      style={{ cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '14px' }}>
                    <button
                        onClick={onSubmit}
                        disabled={submitting}
                        style={{ padding: '10px 14px', cursor: 'pointer' }}
                    >
                        {submitting ? 'Creating…' : 'Create Split'}
                    </button>
                </div>
            </section>

            {/* Search */}
            <section style={{ border: '1px solid #eee', borderRadius: '12px', padding: '12px' }}>
                <h3 style={{ marginTop: 0 }}>Find users to add</h3>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or username"
                        style={{ padding: '10px', flex: 1 }}
                    />
                    <button
                        onClick={onSearch}
                        disabled={searchLoading}
                        style={{ padding: '10px 14px', cursor: 'pointer' }}
                    >
                        {searchLoading ? 'Searching…' : 'Search'}
                    </button>
                </div>

                {searchError && (
                    <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #f2caca' }}>
                        {searchError}
                    </div>
                )}

                <div style={{ marginTop: '12px', display: 'grid', gap: '10px' }}>
                    {results.map((u) => (
                        <div
                            key={u.userId}
                            style={{
                                border: '1px solid #f2f2f2',
                                borderRadius: '10px',
                                padding: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 600 }}>
                                    {u.firstName} {u.lastName} <span style={{ color: '#777' }}>@{u.username}</span>
                                </div>
                                <div style={{ color: '#777' }}>User ID: {u.userId}</div>
                            </div>

                            <button
                                onClick={() => addParticipant(u)}
                                style={{ padding: '10px 14px', cursor: 'pointer' }}
                            >
                                Add
                            </button>
                        </div>
                    ))}

                    {!searchLoading && query.trim() && results.length === 0 && (
                        <div style={{ color: '#777' }}>No users found.</div>
                    )}
                </div>
            </section>
        </div>
    )
}
