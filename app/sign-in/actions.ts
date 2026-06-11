'use server'

import { redirect } from 'next/navigation'
import { verifyCredentials, createAdminSession, destroyAdminSession } from '@/lib/auth'

export type SignInState = { error: boolean }

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!verifyCredentials(email, password)) {
    return { error: true }
  }

  await createAdminSession()
  redirect('/dashboard')
}

export async function signOutAction(): Promise<void> {
  await destroyAdminSession()
  redirect('/')
}
