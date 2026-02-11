import { useEffect, useState } from 'react'
import { searchUsers } from '../../../shared/api/users'
import {
    getIncomingFriendRequests,
    respondToFriendRequest,
    sendFriendRequest
} from '../../../shared/api/friends'
import type { FriendRequestItem, UserSearchItem } from '../../../shared/types/api'

export default function FriendsPanel() {
    // Search
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserSearchItem[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false)


    // Incoming requests
    const [incoming, setIncoming] = useState<FriendRequestItem[]>([])
    const [incomingLoading, setIncomingLoading] = useState(true)
    const [incomingError, setIncomingError] = useState<string | null>(null)

    // Actions
    const [actionMsg, setActionMsg] = useState<string | null>(null)
    const [actionErr, setActionErr] = useState<string | null>(null)
    const [busyId, setBusyId] = useState<number | null>(null)

    useEffect(() => {
        const q = query.trim()

        if (q.length < 3) {
            setResults([])
            setHasSearched(false)
            return
        }

        setSearchLoading(true)
        setHasSearched(true)

        const timeout = setTimeout(async () => {
            try {
                const res = await searchUsers(q)
                setResults(res)
            } catch {
                setSearchError('User search failed.')
            } finally {
                setSearchLoading(false)
            }
        }, 300) // debounce delay

        return () => clearTimeout(timeout)
    }, [query])


    async function loadIncoming() {
        setIncomingError(null)
        setIncomingLoading(true)
        try {
            const res = await getIncomingFriendRequests()
            setIncoming(res)
        } catch {
            setIncomingError('Failed to load incoming requests.')
        } finally {
            setIncomingLoading(false)
        }
    }

    useEffect(() => {
        void loadIncoming()
    }, [])

    async function onSearch() {
        setActionMsg(null)
        setActionErr(null)
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

    async function onSendRequest(receiverId: number) {
        setActionMsg(null)
        setActionErr(null)
        setBusyId(receiverId)

        try {
            await sendFriendRequest({ receiverId })
            setActionMsg('Friend request sent.')
        } catch {
            setActionErr('Failed to send friend request.')
        } finally {
            setBusyId(null)
        }
    }

    async function onRespond(requestId: number, action: 'ACCEPTED' | 'REJECTED') {
        setActionMsg(null)
        setActionErr(null)
        setBusyId(requestId)

        try {
            await respondToFriendRequest({ requestId, action })
            setActionMsg(action === 'ACCEPTED' ? 'Request accepted.' : 'Request rejected.')
            await loadIncoming()
        } catch {
            setActionErr('Failed to respond to request.')
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            <div>
                <h2 style={{ marginTop: 0 }}>Friends</h2>
                <div style={{ color: '#555' }}>Search users and manage incoming requests.</div>
            </div>

            {(actionMsg || actionErr) && (
                <div style={{ padding: '10px', border: `1px solid ${actionErr ? '#f2caca' : '#cdeccd'}` }}>
                    {actionErr ?? actionMsg}
                </div>
            )}

            {/* Search */}
            <section style={{ border: '1px solid #eee', borderRadius: '12px', padding: '12px' }}>
                <h3 style={{ marginTop: 0 }}>Find users</h3>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or username"
                        style={{ padding: '10px', flex: 1 }}
                    />
                    <button onClick={onSearch} disabled={searchLoading} style={{ padding: '10px 14px', cursor: 'pointer' }}>
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
                                onClick={() => onSendRequest(u.userId)}
                                disabled={busyId === u.userId}
                                style={{ padding: '10px 14px', cursor: 'pointer' }}
                            >
                                {busyId === u.userId ? 'Sending…' : 'Add Friend'}
                            </button>
                        </div>
                    ))}

                    {hasSearched && !searchLoading && results.length === 0 && (
                        <div style={{ color: '#777' }}>No users found.</div>
                    )}
                </div>
            </section>

            {/* Incoming */}
            <section style={{ border: '1px solid #eee', borderRadius: '12px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <h3 style={{ marginTop: 0 }}>Incoming requests</h3>
                    <button onClick={loadIncoming} style={{ padding: '10px 14px', cursor: 'pointer' }}>
                        Refresh
                    </button>
                </div>

                {incomingLoading ? (
                    <div>Loading incoming requests…</div>
                ) : incomingError ? (
                    <div>{incomingError}</div>
                ) : incoming.length === 0 ? (
                    <div style={{ color: '#777' }}>No incoming requests.</div>
                ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {incoming.map((r) => (
                            <div
                                key={r.requestId}
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
                                        {r.senderFirstName} <span style={{ color: '#777' }}>({r.senderEmail})</span>
                                    </div>
                                    <div style={{ color: '#777' }}>
                                        {new Date(r.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => onRespond(r.requestId, 'ACCEPTED')}
                                        disabled={busyId === r.requestId}
                                        style={{ padding: '10px 14px', cursor: 'pointer' }}
                                    >
                                        {busyId === r.requestId ? '…' : 'Accept'}
                                    </button>
                                    <button
                                        onClick={() => onRespond(r.requestId, 'REJECTED')}
                                        disabled={busyId === r.requestId}
                                        style={{ padding: '10px 14px', cursor: 'pointer' }}
                                    >
                                        {busyId === r.requestId ? '…' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
