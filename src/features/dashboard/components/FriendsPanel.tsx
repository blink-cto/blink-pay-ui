import { useEffect, useState } from 'react'
import { searchUsers } from '../../../shared/api/users'
import {
    getIncomingFriendRequests,
    respondToFriendRequest,
    sendFriendRequest
} from '../../../shared/api/friends'
import type { FriendRequestItem, UserSearchItem } from '../../../shared/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
        if (q.length < 3) { setResults([]); setHasSearched(false); return }
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
        }, 300)
        return () => clearTimeout(timeout)
    }, [query])

    async function loadIncoming() {
        setIncomingError(null)
        setIncomingLoading(true)
        try {
            setIncoming(await getIncomingFriendRequests())
        } catch {
            setIncomingError('Failed to load incoming requests.')
        } finally {
            setIncomingLoading(false)
        }
    }

    useEffect(() => { void loadIncoming() }, [])

    async function onSearch() {
        setActionMsg(null); setActionErr(null); setSearchError(null)
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

    async function onSendRequest(receiverId: number) {
        setActionMsg(null); setActionErr(null); setBusyId(receiverId)
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
        setActionMsg(null); setActionErr(null); setBusyId(requestId)
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
        <div className="grid gap-5">
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Friends</h2>
                <p className="text-sm text-muted-foreground">Search users and manage incoming requests.</p>
            </div>

            {(actionMsg || actionErr) && (
                <div className={`rounded-lg border px-4 py-3 text-sm ${
                    actionErr
                        ? 'border-destructive/30 bg-destructive/10 text-destructive'
                        : 'border-[#00D4B8]/30 bg-[#00D4B8]/10 text-[#00D4B8]'
                }`}>
                    {actionErr ?? actionMsg}
                </div>
            )}

            {/* Search */}
            <section className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Find users</h3>
                <div className="flex gap-3">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or username (min 3 chars)"
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
                                onClick={() => onSendRequest(u.id)}
                                disabled={busyId === u.id}
                                variant="outline"
                                className="border-[#00D4B8]/40 text-[#00D4B8] hover:bg-[#00D4B8]/10 shrink-0 cursor-pointer"
                            >
                                {busyId === u.id ? 'Sending…' : 'Add Friend'}
                            </Button>
                        </div>
                    ))}
                    {hasSearched && !searchLoading && results.length === 0 && (
                        <div className="text-sm text-muted-foreground">No users found.</div>
                    )}
                </div>
            </section>

            {/* Incoming requests */}
            <section className="border border-border rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Incoming requests</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadIncoming}
                        className="border-border text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        Refresh
                    </Button>
                </div>

                {incomingLoading ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                ) : incomingError ? (
                    <div className="text-sm text-destructive">{incomingError}</div>
                ) : incoming.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No incoming requests.</div>
                ) : (
                    <div className="grid gap-2">
                        {incoming.map((r) => (
                            <div key={r.requestId} className="bg-secondary/50 border border-border rounded-lg p-3 flex justify-between items-center gap-3">
                                <div>
                                    <div className="font-semibold text-foreground text-sm">
                                        {r.senderFirstName} {r.senderLastName}{' '}
                                        <span className="text-muted-foreground font-normal">@{r.senderUsername}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(r.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex flex-col xs:flex-row gap-2 shrink-0">
                                    <Button
                                        size="sm"
                                        onClick={() => onRespond(r.requestId, 'ACCEPTED')}
                                        disabled={busyId === r.requestId}
                                        className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold cursor-pointer"
                                    >
                                        {busyId === r.requestId ? '…' : 'Accept'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onRespond(r.requestId, 'REJECTED')}
                                        disabled={busyId === r.requestId}
                                        className="border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
                                    >
                                        {busyId === r.requestId ? '…' : 'Reject'}
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
