/**
 * Organization membership roles.
 * Single source of truth for the role enum used in DB inserts,
 * validators and UI selects.
 */

export const ORGANIZATION_MEMBER_ROLES = ['admin', 'member'] as const

export type OrganizationMemberRole = (typeof ORGANIZATION_MEMBER_ROLES)[number]
