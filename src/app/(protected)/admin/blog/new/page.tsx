import type { Metadata } from 'next';
import { BlogEditorScreen } from '@/modules/blog/BlogEditorScreen';
import { portalPublishingStrings } from '@/strings';

export const metadata: Metadata = {
  title: portalPublishingStrings.article.newTitle,
};

export default function Page() {
  return <BlogEditorScreen />;
}
