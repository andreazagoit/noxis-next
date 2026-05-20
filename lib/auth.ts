import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization, emailOTP } from 'better-auth/plugins'
import { db } from '@/lib/db'
import * as authSchema from '@/lib/models'
import { sendEmail, otpEmailHtml } from '@/lib/email'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: false,
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false,
      },
    },
  },

  plugins: [
    organization({
      allowUserToCreateOrganization: async (user) => {
        return (user as { role?: string }).role === 'admin'
      },
    }),

    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      disableSignUp: true,
      storeOTP: 'plain',
      generateOTP: () => {
        const isDev = process.env.NODE_ENV !== 'production'
        const code = isDev ? '000000' : undefined
        console.log(`[auth] generateOTP called (NODE_ENV=${process.env.NODE_ENV}) → ${code ?? '(default random)'}`)
        return code
      },
      sendVerificationOTP: async ({ email, otp }) => {
        const isDev = process.env.NODE_ENV !== 'production'
        console.log(`[auth] sendVerificationOTP email=${email} otp=${otp} (dev=${isDev})`)
        if (isDev) return
        await sendEmail({
          to: email,
          subject: `Your Noxis sign-in code: ${otp}`,
          html: otpEmailHtml({ otp }),
        })
      },
    }),
  ],
})
