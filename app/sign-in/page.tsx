import { redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/auth-utils'
import { SignInForm } from './sign-in-form'

export default async function SignInPage() {
  const session = await getCurrentSession()

  if (session) {
    redirect('/dashboard')
  }

  return <SignInForm />
}
