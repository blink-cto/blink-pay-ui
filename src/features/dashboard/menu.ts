export type DashboardTab =
    | 'instant'
    | 'split'
    | 'wallet'
    | 'history'
    | 'friends'
    | 'settle'

export const DASHBOARD_TABS: {key: DashboardTab, label: string}[] = [
    {key: 'instant', label: 'Instant Pay'},
    {key: 'split', label: 'Split Pay'},
    {key: 'wallet', label: 'Wallet'},
    {key: 'history', label: 'History'},
    {key: 'friends', label: 'Friends'},
    {key: 'settle', label: 'Settle Up'}
]