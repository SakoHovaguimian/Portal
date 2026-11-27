'use client';

import { useRef, useState } from 'react';

import { IconButton, Input, UiIcon } from '@/components/ui';
import { componentBrowserStrings as copy } from '@/strings';

import { componentCategories, componentSpecimens } from '../componentSpecimens';
import { componentCategoryAnchor, componentSpecimenAnchor } from '../lib/showcaseAnchors';
import type { ComponentCategory } from '../models/componentCategory';
import type { ComponentSpecimen } from '../models/componentSpecimen';

const linkClassName = 'flex min-h-11 items-center gap-2 rounded-control px-2.5 py-2 text-sm font-medium text-secondary hover:bg-secondary_hover hover:text-primary focus-visible:outline-2 focus-visible:outline-brand';

export function ComponentIndex() {

  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const normalized = query.trim().toLocaleLowerCase('en-US');

  function renderSearch() {

    return (
      <div className="relative min-w-0" role="search">
        <Input
          ref={input}
          aria-label={copy.search}
          type="search"
          value={query}
          placeholder={copy.search}
          leadingIcon={<UiIcon name="search" />}
          className={`[&::-webkit-search-cancel-button]:hidden ${query ? 'pe-12' : 'pe-2'}`}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <IconButton
            variant="ghost"
            label={copy.clearSearch}
            className="absolute inset-e-1 top-1/2 -translate-y-1/2"
            onClick={() => {

              setQuery('');
              input.current?.focus();

            }}
          >
            <UiIcon name="close" className="size-4" />
          </IconButton>
        )}
      </div>
    );

  }

  function renderCategory(category: ComponentCategory) {

    return (
      <li key={category} className="min-w-0">
        <a className={`${linkClassName} justify-between`} href={`#${componentCategoryAnchor(category)}`}>
          <span className="min-w-0 wrap-anywhere">{copy.categories[category]}</span>
          <UiIcon name="chevronRight" className="size-3.5 shrink-0 text-tertiary" />
        </a>
      </li>
    );

  }

  function renderResult(specimen: ComponentSpecimen) {

    return (
      <li key={specimen.id} className="min-w-0">
        <a className={linkClassName} href={`#${componentSpecimenAnchor(specimen)}`}>
          <UiIcon name={specimen.icon} className="size-4 shrink-0 text-tertiary" />
          <span className="min-w-0 wrap-anywhere">{specimen.title}</span>
        </a>
      </li>
    );

  }

  function renderSearchResults() {

    const results = componentSpecimens.filter((item) =>
      `${item.title} ${item.description} ${item.keywords}`
        .toLocaleLowerCase('en-US')
        .includes(normalized));

    return (
      <>
        <p role="status" className="m-0 text-xs text-secondary">
          {results.length ? copy.results(results.length) : copy.emptyTitle}
        </p>
        {results.length ? (
          <ul className="m-0 max-h-[min(20rem,40dvh)] list-none overflow-auto overscroll-contain p-0.5">
            {results.map(renderResult)}
          </ul>
        ) : (
          <p className="m-0 text-sm text-secondary">{copy.emptyDescription}</p>
        )}
      </>
    );

  }

  return (
    <nav
      aria-label={copy.navigation}
      className="grid min-w-0 gap-3 border-y-control border-secondary py-4 xl:sticky xl:top-(--dev-settings-anchor-offset) xl:border-y-0 xl:border-e-control xl:py-0 xl:pe-5"
    >
      {renderSearch()}
      {normalized ? renderSearchResults() : (
        <ul className="m-0 grid list-none gap-x-2 p-0 sm:grid-cols-2 xl:grid-cols-1">
          {componentCategories.map(renderCategory)}
        </ul>
      )}
    </nav>
  );

}
