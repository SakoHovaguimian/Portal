import { z } from 'zod';

import { portalChatStrings as copy } from '@/strings';

export const ConversationMessageUpdateSchema = z.object({ body: z.string().trim().min(1, copy.validation.message).max(4000, copy.validation.message) }).strict();
