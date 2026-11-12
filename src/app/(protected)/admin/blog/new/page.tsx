import type { Metadata } from 'next';

import { portalPublishingStrings } from '@/strings';

import { BlogEditorScreen } from '@/modules/blog/BlogEditorScreen';

export const metadata: Metadata = {
  title: portalPublishingStrings.article.newTitle,
};

export default function Page() {
  return <BlogEditorScreen />;
}
