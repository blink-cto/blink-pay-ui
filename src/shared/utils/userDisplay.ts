type DisplayableUser = {
    role: string
    businessName: string | null
    firstName: string
    lastName: string
}

/** Returns the correct display name: businessName for BUSINESS accounts, "First Last" for PERSONAL. */
export function displayName(user: DisplayableUser): string {
    if (user.role === 'BUSINESS' && user.businessName) return user.businessName
    return `${user.firstName} ${user.lastName}`.trim()
}
