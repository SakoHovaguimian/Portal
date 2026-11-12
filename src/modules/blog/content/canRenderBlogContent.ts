import { isPublicHttpsUrl } from '../models/blogContentUrl';
import { isBlogImageUrl } from '../models/blogImageUrl';
import type { BlogReadableContent } from '../models/blogReadableContent';

export function canRenderBlogContent(block: BlogReadableContent): boolean {

  switch (block.contentType) {

    case 'link':
    case 'embed':
      return isPublicHttpsUrl(block.metaData.url);

    case 'image':
      return isBlogImageUrl(block.metaData.src);

    case 'gallery2':
    case 'gallery3':
    case 'gallery4': {

      const allImagesCanRender = block.metaData.images.every((image) => {

        const imageCanRender = isBlogImageUrl(image.src);
        return imageCanRender;

      });

      return allImagesCanRender;

    }

    default:
      return true;

  }

}
