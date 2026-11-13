import 'server-only';

import type { PortalModule } from '@/config/models/portalModule';
import { strings } from '@/strings';

import { resetDemoChatState, resetDemoChatAccount } from './server/demoChatState';
import { handleDemoChatRequest } from './server/handleDemoChatRequest';
import { handleLiveChatRequest } from './server/handleLiveChatRequest';
import { handleLegacyDemoChat, resetLegacyDemoChat, resetLegacyDemoChatAccount } from './server/legacyDemoChat';

export const chatModule: PortalModule = {
  id: 'chat',
  ownsApiPath: (pathname) => /^\/chat(?:\/|$)/.test(pathname),
  navigation: {
    chat: { href: '/chat', label: strings.ui.appShell.chat, icon: 'mail' },
  },
  workspacePath: '/chat',
  demo: {
    handle: async (context) => {

      const { request, path, current, empty } = context;
      const response = await handleDemoChatRequest(request, path, current, { empty });
      return response ?? handleLegacyDemoChat(context);

    },
    reset: () => {

      resetLegacyDemoChat();
      resetDemoChatState();

    },
    resetAccount: (userId) => {

      resetLegacyDemoChatAccount(userId);
      resetDemoChatAccount(userId);

    },
  },
  live: (request, path, _session, forward) =>
    handleLiveChatRequest(request, path, forward),
};
