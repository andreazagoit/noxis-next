'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateTalent, setTalentSocials } from '@/lib/models/talent/operations'
import type { DbTalentProfile, DbTalentSocial } from '@/lib/models'
import {
  TALENT_SOCIAL_PLATFORMS,
  TALENT_SOCIAL_PLATFORM_META,
  type TalentSocialPlatform,
} from '@/lib/models/talent/config'

type SocialRow = { platform: TalentSocialPlatform; handle: string; url: string }

export function TalentProfileForm({
  profile,
  socials: initialSocials,
}: {
  profile: DbTalentProfile
  socials: DbTalentSocial[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [displayName, setDisplayName] = useState(profile.displayName)
  const [slug, setSlug] = useState(profile.slug)
  const [bio, setBio] = useState(profile.bio ?? '')
  const [city, setCity] = useState(profile.city ?? '')
  const [country, setCountry] = useState(profile.country ?? '')
  const [socials, setSocials] = useState<SocialRow[]>(
    initialSocials.map((s) => ({
      platform: s.platform,
      handle: s.handle,
      url: s.url ?? '',
    })),
  )

  const addSocial = () =>
    setSocials((prev) => [...prev, { platform: 'instagram', handle: '', url: '' }])

  const updateSocial = (idx: number, patch: Partial<SocialRow>) =>
    setSocials((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))

  const removeSocial = (idx: number) =>
    setSocials((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    startTransition(async () => {
      const profileResult = await updateTalent(profile.id, {
        displayName,
        slug,
        bio: bio || null,
        city: city || null,
        country: country || null,
      })
      if (!profileResult.ok) {
        setMessage({ type: 'error', text: profileResult.error })
        return
      }

      const cleanSocials = socials
        .filter((s) => s.handle.trim().length > 0)
        .map((s) => ({
          platform: s.platform,
          handle: s.handle.trim(),
          url: s.url.trim() || null,
        }))

      const socialsResult = await setTalentSocials(profile.id, cleanSocials)
      if (!socialsResult.ok) {
        setMessage({ type: 'error', text: socialsResult.error })
        return
      }

      setMessage({ type: 'success', text: 'Saved' })
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <Typography variant="h4">
          Profile
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              pattern="[a-z0-9-]+"
            />
            <p className="text-xs text-muted-foreground">
              URL identifier — lowercase letters, numbers, and dashes only.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bio">Description</Label>
          <Textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Who is this talent, niche, tone, anything to know..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Typography variant="h4">
              Social accounts
            </Typography>
            <p className="text-xs text-muted-foreground">
              One row per platform. Add as many as needed.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addSocial}>
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        {socials.length > 0 && (
          <div className="flex flex-col gap-2">
            {socials.map((s, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[10rem_1fr_1fr_auto] gap-2 items-center"
              >
                <Select
                  value={s.platform}
                  onValueChange={(v) =>
                    updateSocial(idx, { platform: v as TalentSocialPlatform })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TALENT_SOCIAL_PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {TALENT_SOCIAL_PLATFORM_META[p].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={s.handle}
                  onChange={(e) => updateSocial(idx, { handle: e.target.value })}
                  placeholder="username"
                />
                <Input
                  value={s.url}
                  onChange={(e) => updateSocial(idx, { url: e.target.value })}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocial(idx)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && (
        <p
          className={
            message.type === 'success'
              ? 'text-xs text-emerald-500'
              : 'text-xs text-red-500'
          }
        >
          {message.text}
        </p>
      )}

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
