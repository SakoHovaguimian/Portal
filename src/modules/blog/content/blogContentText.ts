import { BlogReadableContentSchema } from '../models/blogReadableContent';
import type { StoredBlogContent } from '../models/storedBlogContent';

export function blogContentText(content: StoredBlogContent[]): string {

  const blockTexts = content.map((stored) => {

    const result = BlogReadableContentSchema.safeParse(stored);
    if (!result.success) { return JSON.stringify(stored.metaData); }
    const block = result.data;
    switch (block.contentType) {

      case 'header':
      case 'footer':
        return block.metaData.text;

      case 'section':
        return `${block.metaData.title ?? ''} ${block.metaData.body}`;

      case 'quote':
        return `${block.metaData.text} ${block.metaData.attribution ?? ''}`;

      case 'bullet':
        return block.metaData.items.join(' ');

      case 'callout':
        return `${block.metaData.title ?? ''} ${block.metaData.text}`;

      case 'link':
        return block.metaData.text;

      case 'embed':
        return `${block.metaData.title ?? ''} ${block.metaData.caption ?? ''}`;

      case 'image':
        return `${block.metaData.alt} ${block.metaData.caption ?? ''}`;

      case 'gallery2':
      case 'gallery3':
      case 'gallery4': {

        const imageDescriptions = block.metaData.images.map((image) => {

          const imageDescription = `${image.alt} ${image.caption ?? ''}`;
          return imageDescription;

        });
        const galleryText = `${block.metaData.caption ?? ''} ${imageDescriptions.join(' ')}`;
        return galleryText;

      }

      case 'divider':
        return '';

    }

  });
  const contentText = blockTexts.join(' ');
  return contentText;

}
