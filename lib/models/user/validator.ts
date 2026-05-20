import { z } from 'zod'
import { USER_ROLES } from '@/lib/models/user/config'

export type { UserRoleEnum } from '@/lib/models/user/config'

export const UserCreateSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(120),
  role: z.enum(USER_ROLES).default('user'),
})

export const UserUpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.enum(USER_ROLES).optional(),
})

export type UserCreateInput = z.input<typeof UserCreateSchema>
export type UserUpdateInput = z.input<typeof UserUpdateSchema>
