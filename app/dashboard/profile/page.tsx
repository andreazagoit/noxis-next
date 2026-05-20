import Link from 'next/link'
import { requireSession } from '@/lib/auth-utils'
import { getTalentByUserId, listTalentSocials } from '@/lib/models/talent/operations'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { TalentProfileForm } from './talent-profile-form'

export default async function ProfilePage() {
  const session = await requireSession()
  const profile = await getTalentByUserId(session.user.id)
  const socials = profile ? await listTalentSocials(profile.id) : []

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
        <Typography variant="h4">
          No talent profile yet
        </Typography>
        <Typography variant="body" className="text-muted-foreground max-w-sm">
          Your account exists but no talent profile is linked. Contact an admin.
        </Typography>
        <Button asChild className="mt-2" variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <PageHeader
        title={profile.displayName}
        description={`@${profile.slug} · ${session.user.email}`}
      />

      <TalentProfileForm profile={profile} socials={socials} />
    </div>
  )
}
