import { z } from 'zod';

import { portalChatStrings as copy } from '@/strings';

import { ChatConversationKindSchema } from './chatConversationKind';

export const ChatConversationInputSchema = z.object({
  kind: ChatConversationKindSchema,
  name: z.string().trim().max(80, copy.validation.groupName),
  description: z.string().trim().max(400),
  memberIds: z.array(z.string().min(1)).min(1, copy.validation.people).max(19, copy.validation.people),
}).strict().superRefine((input, context) => {

  if (input.kind === 'direct' && input.memberIds.length !== 1) {

    context.addIssue({
      code: 'custom',
      message: copy.validation.people,
    });

  }
  if (input.kind === 'group' && !input.name) {

    context.addIssue({
      code: 'custom',
      message: copy.validation.groupName,
    });

  }

});

export type ChatConversationInput = z.infer<typeof ChatConversationInputSchema>;
