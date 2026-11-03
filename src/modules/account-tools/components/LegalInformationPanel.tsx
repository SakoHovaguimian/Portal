import {
  Card,
  EmptyState,
  Message,
  PageSection,
  QueryBoundary,
} from '@/components/ui';
import { portalAccountToolsStrings as copy } from '@/strings';
import { useLegalInformation } from '../hooks';
import type { LegalInformationPanelProps } from '../models/legalInformationPanelProps';
import { AccountToolsLoading } from './AccountToolsLoading';

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
        className="m-0 whitespace-pre-line text-sm text-secondary wrap-anywhere"
      >
        {paragraph}
      </p>
    ));
    return (
      <PageSection
        key={`${item.title}-${index}`}
        id={`${context}-${index}`}
        title={item.title}
      >
        <Card className="grid gap-4">{paragraphs}</Card>
      </PageSection>
    );

  }

  function renderItems(result: NonNullable<typeof query.data>) {

    if (!result.items.length) {

      return (
        <EmptyState
          title={copy.help.emptyTitle}
          description={copy.help.emptyHint}
        />
      );

    }
    const pageSections = result.items.map(renderItem);
    return pageSections;

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
