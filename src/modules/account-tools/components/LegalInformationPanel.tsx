import {
  EmptyState,
  Message,
  QueryBoundary,
  SectionStack,
  SplitSection,
} from '@/components/ui';
import { portalAccountToolsStrings as copy } from '@/strings';

import { AccountToolsLoading } from './AccountToolsLoading';
import styles from '../Help.module.css';
import { useLegalInformation } from '../hooks';
import type { LegalInformationPanelProps } from '../models/legalInformationPanelProps';

export function LegalInformationPanel({
  context,
}: LegalInformationPanelProps) {

  const query = useLegalInformation(context);

  function renderItem(
    item: NonNullable<typeof query.data>['items'][number],
    index: number,
  ) {

    const paragraphs = item.sections.map((paragraph, paragraphIndex) => (
      <p
        key={paragraphIndex}
        className={styles.legalParagraph}
      >
        {paragraph}
      </p>
    ));
    return (
      <SplitSection
        bare
        key={`${item.title}-${index}`}
        id={`${context}-${index}`}
        title={item.title}
      >
        <div className={styles.legalText}>{paragraphs}</div>
      </SplitSection>
    );

  }

  function renderItems(result: NonNullable<typeof query.data>) {

    if (!result.items.length) {

      return (
        <EmptyState
          variant="plain"
          title={copy.help.emptyTitle}
          description={copy.help.emptyHint}
        />
      );

    }
    const pageSections = result.items.map(renderItem);
    return <SectionStack>{pageSections}</SectionStack>;

  }

  function renderContent(result: NonNullable<typeof query.data>) {

    return (
      <div className="grid gap-6">
        {result.illustrative && (
          <Message
            title={copy.help.illustrativeTitle}
            description={copy.help.illustrativeDescription}
            intent="warning"
          />
        )}
        {renderItems(result)}
      </div>
    );

  }

  return (
    <QueryBoundary query={query} loadingFallback={<AccountToolsLoading />}>
      {(result) => renderContent(result)}
    </QueryBoundary>
  );

}
