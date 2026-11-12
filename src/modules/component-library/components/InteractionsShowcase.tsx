'use client';

import { useState } from 'react';

import {
  Accordion,
  BookmarkButton,
  Button,
  Card,
  ContentTransition,
  DatePicker,
  Field,
  HorizontalCarousel,
  IconMenu,
  MultiSelect,
  RatingSummary,
  ReactionButton,
  SegmentedPanels,
  StarRating,
} from '@/components/ui';
import { useUrlState } from '@/providers/useUrlState';
import { portalUiStrings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = portalUiStrings.library;
const views = ['overview', 'details', 'history'] as const;

export function InteractionsShowcase() {

  const [view, setView] = useUrlState('exampleView', 'overview', views);
  const [date, setDate] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [revision, setRevision] = useState(1);
  const [removed, setRemoved] = useState(false);
  const count = liked ? 13 : 12;

  function renderValueAndEngagementControls() {

    const choiceOptions = copy.options.map((label) => ({ value: label, label }));

    return (
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="grid min-w-0 content-start gap-4">
          <DatePicker
            label={copy.date}
            value={date}
            onValueChange={setDate}
            describedBy="library-calendar-help"
          />
          <p id="library-calendar-help" className="m-0 text-xs text-tertiary">
            {copy.dateHint}
          </p>
          <Field labelText={copy.limitedSelect}>
            <MultiSelect
              value={selected}
              onValueChange={setSelected}
              label={copy.limitedSelect}
              placeholder={copy.selectPlaceholder}
              clearLabel={copy.clear}
              selectAllLabel={copy.selectAll}
              selectionLabel={copy.selectionCount}
              maxSelections={2}
              options={choiceOptions}
            />
          </Field>
        </div>
        <div className="grid min-w-0 content-start gap-5">
          <StarRating
            label={copy.rating}
            value={rating}
            onValueChange={setRating}
            getOptionLabel={copy.ratingOption}
            valueLabel={copy.ratingValue(rating)}
          />
          <RatingSummary
            average={4.5}
            count={24}
            label={copy.ratingSummary}
            averageLabel={copy.average}
            countLabel={copy.count}
            emptyLabel={copy.noRatings}
          />
          <div className="flex flex-wrap items-center gap-3">
            <ReactionButton
              liked={liked}
              label={liked ? copy.liked : copy.like}
              count={count}
              countLabel={copy.reactions(count)}
              onClick={() => {
                setLiked((value) => !value);
              }}
            />
            <BookmarkButton
              saved={saved}
              variant="secondary"
              onClick={() => {
                setSaved((value) => !value);
              }}
            />
            <IconMenu
              label={copy.menu}
              items={[
                {
                  id: 'open',
                  icon: 'layers',
                  label: copy.menuOpen,
                  href: '/dev-settings/components',
                },
                {
                  id: 'remove',
                  icon: 'trash',
                  label: copy.menuRemove,
                  variant: 'destructive',
                  disabled: removed,
                },
              ]}
              onAction={(id) => {

                if (id === 'remove') { setRemoved(true); }

              }}
            />
          </div>
          {removed && (
            <p role="status" className="m-0 text-xs text-tertiary">
              {copy.menuRemoved}
            </p>
          )}
        </div>
      </div>
    );

  }

  function renderPanels() {

    return (
      <SegmentedPanels
        value={view}
        onValueChange={(next) => {
          void setView(next);
        }}
        label={copy.tabs}
        panels={[
          {
            value: views[0],
            label: copy.tabOverview,
            content: (
              <p className="m-0 text-sm text-secondary">
                {copy.tabOverviewBody}
              </p>
            ),
          },
          {
            value: views[1],
            label: copy.tabDetails,
            content: (
              <p className="m-0 text-sm text-secondary">
                {copy.tabDetailsBody}
              </p>
            ),
          },
          {
            value: views[2],
            label: copy.tabHistory,
            content: (
              <p className="m-0 text-sm text-secondary">
                {copy.tabHistoryBody}
              </p>
            ),
          },
        ]}
      />
    );

  }

  function renderAccordion() {

    return (
      <Accordion
        items={[
          {
            id: 'disclosure',
            title: copy.accordionTitle,
            content: copy.accordionBody,
          },
          {
            id: 'motion',
            title: copy.accordionSecond,
            content: copy.accordionSecondBody,
          },
        ]}
      />
    );

  }

  function renderCarousel() {

    function renderCarouselCard(title: string) {

      return (
        <Card key={title} className="grid content-start gap-3">
          <h3 className="m-0 text-base font-semibold text-primary">
            {title}
          </h3>
          <p className="m-0 text-sm text-secondary">{copy.carouselBody}</p>
        </Card>
      );

    }

    const carouselCards = copy.carouselTitles.map(renderCarouselCard);

    return (
      <HorizontalCarousel label={copy.carousel}>
        {carouselCards}
      </HorizontalCarousel>
    );

  }

  function renderContentTransition() {

    return (
      <div className="grid min-w-0 justify-items-start gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            setRevision((value) => value + 1);
          }}
        >
          {copy.transition}
        </Button>
        <ContentTransition revision={revision}>
          <p className="m-0 text-sm text-secondary">
            {copy.transitionValue(revision)}
          </p>
        </ContentTransition>
      </div>
    );

  }

  return (
    <ShowcaseSection
      id="interactions"
      title={copy.title}
      description={copy.description}
      icon="layers"
    >
      {renderValueAndEngagementControls()}
      {renderPanels()}
      {renderAccordion()}
      {renderCarousel()}
      {renderContentTransition()}
    </ShowcaseSection>
  );

}
