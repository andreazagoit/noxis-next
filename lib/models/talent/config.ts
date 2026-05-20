/**
 * Talent domain values.
 */

export const TALENT_STATUSES = ['draft', 'active', 'paused', 'archived'] as const

export type TalentStatus = (typeof TALENT_STATUSES)[number]

export const TALENT_SOCIAL_PLATFORMS = [
  'instagram',
  'tiktok',
  'youtube',
  'x',
  'linkedin',
  'twitch',
  'facebook',
  'threads',
  'website',
] as const

export type TalentSocialPlatform = (typeof TALENT_SOCIAL_PLATFORMS)[number]

export const TALENT_SOCIAL_PLATFORM_META: Record<
  TalentSocialPlatform,
  { label: string }
> = {
  instagram: { label: 'Instagram' },
  tiktok: { label: 'TikTok' },
  youtube: { label: 'YouTube' },
  x: { label: 'X' },
  linkedin: { label: 'LinkedIn' },
  twitch: { label: 'Twitch' },
  facebook: { label: 'Facebook' },
  threads: { label: 'Threads' },
  website: { label: 'Website' },
}
