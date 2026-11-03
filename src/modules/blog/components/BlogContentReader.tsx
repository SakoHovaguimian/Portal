import { portalPublishingStrings } from '@/strings';
import { BlogContentImage } from './BlogContentImage';
import { MarkdownContent } from '@/components/ui';
import {
  BlogReadableContentSchema,
} from '../models/blogReadableContent';
import { BlogContentSchema } from '../models/blogContent';
import type { StoredBlogContent } from '../models/storedBlogContent';
import { BlogEmbeddedMedia } from './BlogEmbeddedMedia';
import { canRenderBlogContent } from '../content/canRenderBlogContent';
import styles from '../Blog.module.css';
import type { BlogContentImageRendererProps } from '../models/blogContentImageRendererProps';
import type { BlogContentBlockRendererProps } from '../models/blogContentBlockRendererProps';
import type { BlogContentReaderProps } from '../models/blogContentReaderProps';

const copy = portalPublishingStrings.builder;

function ContentImage({ image }: BlogContentImageRendererProps) {

  return (
    <figure className={styles.contentFigure}>
      <BlogContentImage
        src={image.src}
        alt={image.alt}
        width={1200}
        height={800}
        unoptimized
        sizes="(max-width: 700px) 94vw, 700px"
        className={styles.contentImage}
      />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );

}

function ContentBlock({ block }: BlogContentBlockRendererProps) {

  switch (block.contentType) {

    case 'header':
      return <h2>{block.metaData.text}</h2>;
    case 'section':
      return (
        <section className={styles.contentSection}>
          {block.metaData.title && <h2>{block.metaData.title}</h2>}
          {block.metaData.format === 'markdown' ? (
            <MarkdownContent
              value={block.metaData.body}
              headingContext="article"
            />
          ) : (
            <p className={styles.contentText}>{block.metaData.body}</p>
          )}
        </section>
      );
    case 'footer':
      return (
        <footer className={styles.contentFooter}>
          <p className={styles.contentText}>{block.metaData.text}</p>
        </footer>
      );
    case 'quote':
      return (
        <blockquote className={styles.contentQuote}>
          <p>{block.metaData.text}</p>
          {block.metaData.attribution && (
            <cite>{block.metaData.attribution}</cite>
          )}
        </blockquote>
      );
    case 'bullet':
      return (
        <ul>
          {block.metaData.items.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      );
    case 'divider':
      return <hr className={styles.contentDivider} />;
    case 'image':
      return <ContentImage image={block.metaData} />;
    case 'gallery2':
    case 'gallery3':
    case 'gallery4':
      return (
        <figure className={styles.contentFigure}>
          <div
            className={styles.contentGallery}
            data-count={block.metaData.images.length}
          >
            {block.metaData.images.map((image, index) => (
              <ContentImage key={index} image={image} />
            ))}
          </div>
          {block.metaData.caption && (
            <figcaption>{block.metaData.caption}</figcaption>
          )}
        </figure>
      );
    case 'callout':
      return (
        <aside className={styles.contentCallout}>
          <h3>{block.metaData.title}</h3>
          <p className={styles.contentText}>{block.metaData.text}</p>
        </aside>
      );
    case 'link':
      return (
        <p>
          <a
            className={styles.contentLink}
            href={block.metaData.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {block.metaData.text}
          </a>
        </p>
      );
    case 'embed':
      return <BlogEmbeddedMedia metaData={block.metaData} />;

  }

}

export function BlogContentReader({ content }: BlogContentReaderProps) {

  function renderContentRow(block: StoredBlogContent, index: number) {

    const parsed = BlogReadableContentSchema.safeParse(block);
    const renderable = parsed.success && canRenderBlogContent(parsed.data);
    const writable = BlogContentSchema.safeParse(block);
    const additionalData =
      !writable.success &&
      writable.error.issues.some(
        (issue) => issue.code === 'unrecognized_keys',
      );
    return (
      <div
        key={`${block.id}-${index}`}
        data-content-type={block.contentType}
      >
        {parsed.success && renderable && (
          <ContentBlock block={parsed.data} />
        )}
        {(!renderable || additionalData) && (
          <>
            <p className="text-tertiary">
              {renderable
                ? copy.savedBlockAdditionalDescription
                : copy.savedBlockUnavailableDescription}
            </p>
            <pre className="whitespace-pre-wrap wrap-anywhere">
              {JSON.stringify(block, null, 2)}
            </pre>
          </>
        )}
      </div>
    );

  }

  function renderContent() {

    const contentRows = content.map(renderContentRow);
    return <div className={styles.structuredContent}>{contentRows}</div>;

  }

  return renderContent();

}
