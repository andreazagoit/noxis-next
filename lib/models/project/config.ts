/**
 * Project & project event domain values.
 * Source of truth for both the DB enums and the UI options.
 */

export const PROJECT_STATUSES = [
  'draft',
  'proposed',
  'approved',
  'in_progress',
  'completed',
  'archived',
] as const

export const PROJECT_EVENT_TYPES = [
  // Content / talent
  'post',
  'story',
  'reel',
  'video',
  'event',
  // Development
  'design',
  'development',
  'maintenance',
] as const

export const PROJECT_EVENT_PLATFORMS = [
  'instagram',
  'tiktok',
  'youtube',
  'x',
  'web',
] as const

export const PROJECT_EVENT_STATUSES = [
  'planned',
  'in_review',
  'approved',
  'live',
  'cancelled',
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type ProjectEventType = (typeof PROJECT_EVENT_TYPES)[number]
export type ProjectEventPlatform = (typeof PROJECT_EVENT_PLATFORMS)[number]
export type ProjectEventStatus = (typeof PROJECT_EVENT_STATUSES)[number]

// ────────────────────────────────────────────────────────────────────
// LABELS & DESCRIPTIONS
// User-facing copy for selects, dialogs, and badges. Keep concise.
// ────────────────────────────────────────────────────────────────────

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; description: string }
> = {
  draft: {
    label: 'Draft',
    description: 'Initial setup, not yet shared with the client.',
  },
  proposed: {
    label: 'Proposed',
    description: 'Sent to the client, waiting for approval.',
  },
  approved: {
    label: 'Approved',
    description: 'Client approved. Ready to start execution.',
  },
  in_progress: {
    label: 'In progress',
    description: 'Work is underway. Items are being delivered.',
  },
  completed: {
    label: 'Completed',
    description: 'All items delivered and signed off.',
  },
  archived: {
    label: 'Archived',
    description: 'Closed and removed from active views.',
  },
}

export const PROJECT_EVENT_TYPE_META: Record<
  ProjectEventType,
  { label: string; description: string }
> = {
  post: {
    label: 'Post',
    description: 'A feed post (image or carousel) on a social platform.',
  },
  story: {
    label: 'Story',
    description: 'A short, 24h-lived story segment with one or more frames.',
  },
  reel: {
    label: 'Reel',
    description: 'A short-form vertical video — Reel, Short, or TikTok.',
  },
  video: {
    label: 'Video',
    description: 'A long-form video, typically for YouTube or web.',
  },
  event: {
    label: 'Event',
    description: 'An in-person or live activation (launch, shoot, party).',
  },
  design: {
    label: 'Design',
    description: 'Visual or UX work — mockups, brand, layout. Specify in the title.',
  },
  development: {
    label: 'Development',
    description: 'Any build work — site, app, integration, feature. Specify in the title.',
  },
  maintenance: {
    label: 'Maintenance',
    description: 'Ongoing fixes and updates on an existing build.',
  },
}

export const PROJECT_EVENT_PLATFORM_META: Record<
  ProjectEventPlatform,
  { label: string; description: string }
> = {
  instagram: { label: 'Instagram', description: 'Meta — feed, reels, stories.' },
  tiktok: { label: 'TikTok', description: 'Short-form vertical video.' },
  youtube: { label: 'YouTube', description: 'Long-form and Shorts.' },
  x: { label: 'X', description: 'Formerly Twitter.' },
  web: { label: 'Web', description: 'Hosted on the brand or partner website.' },
}

export const PROJECT_EVENT_STATUS_META: Record<
  ProjectEventStatus,
  { label: string; description: string }
> = {
  planned: {
    label: 'Planned',
    description: 'Scheduled but not yet started.',
  },
  in_review: {
    label: 'In review',
    description: 'Submitted for internal or client review.',
  },
  approved: {
    label: 'Approved',
    description: 'Reviewed and ready to publish or execute.',
  },
  live: {
    label: 'Live',
    description: 'Published or completed.',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'No longer happening.',
  },
}
