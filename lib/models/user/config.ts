/**
 * User domain values.
 */

export const USER_ROLES = ['admin', 'user'] as const

export type UserRoleEnum = (typeof USER_ROLES)[number]
