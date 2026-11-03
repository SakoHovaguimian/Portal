import type { BlogReadableContent } from './blogReadableContent';

export interface BlogEmbeddedMediaProps {
  metaData: Extract<BlogReadableContent, { contentType: 'embed' }>['metaData'];
}
