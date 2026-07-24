export type EmptyStateIllustration = 'activity' | 'chat' | 'files' | 'people' | 'resources' | 'search'

export const EmptyStateIllustrationPaths: Record<EmptyStateIllustration, string> = {
  activity: '/empty-states/activity.png',
  chat: '/empty-states/chat.png',
  files: '/empty-states/files.png',
  people: '/empty-states/people.png',
  resources: '/empty-states/files.png',
  search: '/empty-states/search.png',
}
