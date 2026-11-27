import {
  Accordion,
  EmptyState,
  Message,
  QueryBoundary,
  SectionStack,
  SplitSection,
} from '@/components/ui';
import { portalAccountToolsStrings as copy } from '@/strings';

import { AccountToolsLoading } from './AccountToolsLoading';
import styles from '../Help.module.css';
import { useFrequentlyAskedQuestions } from '../hooks';

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
      <SplitSection
        bare
        key={`${section.title}-${index}`}
        id={`faq-${index}`}
        title={section.title}
      >
        <Accordion
          items={faqItems}
          className={styles.questions}
          itemClassName="rounded-none border-0 border-b-control border-secondary bg-transparent"
        />
      </SplitSection>
    );

  }

  function renderSections(result: NonNullable<typeof query.data>) {

    if (!result.sections.length) {

      return (
        <EmptyState
          variant="plain"
          title={copy.help.emptyTitle}
          description={copy.help.emptyHint}
        />
      );

    }
    const pageSections = result.sections.map(renderSection);
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
