import {
  Accordion,
  EmptyState,
  Message,
  PageSection,
  QueryBoundary,
} from '@/components/ui';
import { portalAccountToolsStrings as copy } from '@/strings';
import { useFrequentlyAskedQuestions } from '../hooks';
import { AccountToolsLoading } from './AccountToolsLoading';

export function FrequentlyAskedQuestionsPanel() {

  const query = useFrequentlyAskedQuestions();

  function renderSection(
    section: NonNullable<typeof query.data>['sections'][number],
    index: number,
  ) {

    const faqItems = section.sections.map((faq, faqIndex) => ({
      id: `faq-${index}-${faqIndex}`,
      title: faq.question,
      content: (
        <p className="m-0 whitespace-pre-line leading-relaxed wrap-anywhere">
          {faq.answer}
        </p>
      ),
    }));
    return (
      <PageSection
        key={`${section.title}-${index}`}
        id={`faq-${index}`}
        title={section.title}
      >
        <Accordion items={faqItems} />
      </PageSection>
    );

  }

  function renderSections(result: NonNullable<typeof query.data>) {

    if (!result.sections.length) {

      return (
        <EmptyState
          title={copy.help.emptyTitle}
          description={copy.help.emptyHint}
        />
      );

    }
    const pageSections = result.sections.map(renderSection);
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
        {renderSections(result)}
      </div>
    );

  }

  return (
    <QueryBoundary query={query} loadingFallback={<AccountToolsLoading />}>
      {(result) => renderContent(result)}
    </QueryBoundary>
  );

}
