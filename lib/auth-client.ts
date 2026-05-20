import { createAuthClient } from 'better-auth/react'
import { organizationClient, emailOTPClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? 'http://localhost:3000',
  plugins: [organizationClient(), emailOTPClient()],
})

export const { signIn, signOut, useSession, emailOtp, organization } = authClient
