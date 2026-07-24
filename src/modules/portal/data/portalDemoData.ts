import { strings } from '@/content/strings'
import type { PortalActivity } from '@/models/portalActivity'
import type { PortalMember } from '@/models/portalMember'
import type { PortalResource } from '@/models/portalResource'

export const portalActivities: PortalActivity[] = [
  {
    id: 'activity-design-approved',
    title: strings.demo.activities.approvedTitle,
    detail: strings.demo.activities.approvedDetail,
    time: strings.demo.members.now,
    tone: 'success',
  },
  {
    id: 'activity-access-updated',
    title: strings.demo.activities.accessTitle,
    detail: strings.demo.activities.accessDetail,
    time: strings.demo.members.yesterday,
    tone: 'accent',
  },
  {
    id: 'activity-guide-published',
    title: strings.demo.activities.guideTitle,
    detail: strings.demo.activities.guideDetail,
    time: strings.demo.members.twoDaysAgo,
    tone: 'info',
  },
  {
    id: 'activity-digest-completed',
    title: strings.demo.activities.automationTitle,
    detail: strings.demo.activities.automationDetail,
    time: strings.demo.members.twoDaysAgo,
    tone: 'warning',
  },
]

export const portalMembers: PortalMember[] = [
  {
    id: 'member-morgan',
    name: strings.demo.members.morgan,
    email: 'morgan@example.com',
    initials: 'ML',
    role: strings.demo.members.owner,
    status: strings.demo.members.active,
    lastActive: strings.demo.members.now,
  },
  {
    id: 'member-alex',
    name: strings.demo.members.alex,
    email: 'alex@example.com',
    initials: 'AR',
    role: strings.demo.members.admin,
    status: strings.demo.members.active,
    lastActive: strings.demo.members.now,
  },
  {
    id: 'member-jordan',
    name: strings.demo.members.jordan,
    email: 'jordan@example.com',
    initials: 'JC',
    role: strings.demo.members.member,
    status: strings.demo.members.active,
    lastActive: strings.demo.members.yesterday,
  },
  {
    id: 'member-sam',
    name: strings.demo.members.sam,
    email: 'sam@example.com',
    initials: 'SP',
    role: strings.demo.members.viewer,
    status: strings.demo.members.invited,
    lastActive: strings.demo.members.pending,
  },
]

export const portalResources: PortalResource[] = [
  {
    id: 'resource-onboarding',
    name: strings.demo.resources.onboarding,
    type: strings.demo.resources.guide,
    owner: strings.demo.members.morgan,
    updated: strings.demo.members.now,
  },
  {
    id: 'resource-launch',
    name: strings.demo.resources.launch,
    type: strings.demo.resources.checklist,
    owner: strings.demo.members.alex,
    updated: strings.demo.members.yesterday,
  },
  {
    id: 'resource-design',
    name: strings.demo.resources.design,
    type: strings.demo.resources.reference,
    owner: strings.demo.members.jordan,
    updated: strings.demo.members.twoDaysAgo,
  },
  {
    id: 'resource-api',
    name: strings.demo.resources.api,
    type: strings.demo.resources.diagram,
    owner: strings.demo.members.morgan,
    updated: strings.demo.members.twoDaysAgo,
  },
]
