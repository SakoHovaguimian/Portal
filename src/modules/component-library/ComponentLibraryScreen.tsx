'use client';

import { useRef, useState } from 'react';

import {
  Badge,
  Button,
  IconButton,
  Input,
  Page,
  PageHeader,
  Select,
  UiIcon,
} from '@/components/ui';
import { useUrlState } from '@/providers/useUrlState';
import { componentBrowserStrings as copy } from '@/strings';

import { ComponentCatalog } from './components/ComponentCatalog';
import {
  componentCategories,
  componentIds,
  componentSpecimens,
} from './componentSpecimens';
import type { ComponentSpecimen } from './models/componentSpecimen';

export function ComponentLibraryScreen() {

  const [selected, setSelected] = useUrlState(
    'component',
    'catalog',
    componentIds,
  );
  const [category, setCategory] = useUrlState(
    'category',
    'all',
    componentCategories,
  );
  const [query, setQuery] = useState('');
  const [visited, setVisited] = useState<string[]>([selected]);
  const search = useRef<HTMLInputElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const active = componentSpecimens.find((item) => item.id === selected);
  const normalized = query.trim().toLocaleLowerCase('en-US');
  const filtered = componentSpecimens.filter(
    (item) =>
      (category === 'all' || category === item.category) &&
      `${item.title} ${item.description} ${item.keywords}`
        .toLocaleLowerCase('en-US')
        .includes(normalized),
  );
  // History traversal can open a specimen without going through a catalog button.
  if (!visited.includes(selected)) { setVisited([...visited, selected]); }

  const open = async (id: string) => {

    if (!(await setSelected(id))) { return; }
    requestAnimationFrame(() => {

      previewHeading.current?.focus();
      previewHeading.current?.scrollIntoView({ block: 'start' });

    });

  };
  const position = componentSpecimens.findIndex((item) => item.id === selected);

  function renderHeader() {

    return (
      <PageHeader
        title={copy.title}
        description={copy.description}
      />
    );

  }

  function renderCategories() {

    function renderCategoryOption(key: (typeof componentCategories)[number]) {

      return (
        <option key={key} value={key}>
          {copy.categories[key]}
        </option>
      );

    }

    const categoryOptions = componentCategories.map(renderCategoryOption);

    function renderCategoryButton(key: (typeof componentCategories)[number]) {

      return (
        <Button
          key={key}
          variant="ghost"
          aria-pressed={category === key}
          className="min-h-11 justify-between gap-3 px-3 text-left aria-pressed:bg-brand-primary aria-pressed:text-brand-secondary"
          onClick={() => void setCategory(key, { clearParams: ['component'] })}
        >
          <span>{copy.categories[key]}</span>
          <span className="text-xs tabular-nums text-tertiary">
            {key === 'all'
              ? componentSpecimens.length
              : componentSpecimens.filter((item) => item.category === key)
                .length}
          </span>
        </Button>
      );

    }

    const categoryButtons = componentCategories.map(renderCategoryButton);

    return (
      <aside className="min-w-0 xl:sticky xl:top-24">
        <div className="sm:hidden">
          <Select
            aria-label={copy.navigation}
            value={category}
            onValueChange={(next) => {

              const key = componentCategories.find((item) => item === next);
              if (key) { void setCategory(key, { clearParams: ['component'] }); }

            }}
          >
            {categoryOptions}
          </Select>
        </div>
        <nav
          aria-label={copy.navigation}
          className="hidden min-w-0 flex-wrap gap-1 sm:flex xl:grid"
        >
          {categoryButtons}
        </nav>
      </aside>
    );

  }

  function renderCatalog() {

    return (
      !active && (
        <>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="m-0 text-lg font-semibold text-primary">
                {copy.categories[category]}
              </h2>
              <p className="m-0 mt-1 text-sm text-tertiary">
                {copy.categoryHints[category]}
              </p>
            </div>
            <div
              role="search"
              className="flex min-w-0 flex-1 basis-64 items-center gap-1 md:max-w-sm"
            >
              <div className="min-w-0 flex-1">
                <Input
                  ref={search}
                  aria-label={copy.search}
                  type="search"
                  value={query}
                  placeholder={copy.searchPlaceholder}
                  leadingIcon={<UiIcon name="search" />}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              {query && (
                <IconButton
                  variant="ghost"
                  label={copy.clearSearch}
                  onClick={() => {

                    setQuery('');
                    search.current?.focus();

                  }}
                >
                  <UiIcon name="close" className="size-4" />
                </IconButton>
              )}
            </div>
          </div>
          <p role="status" className="m-0 text-xs text-tertiary">
            {copy.results(filtered.length)}
          </p>
          <ComponentCatalog
            items={filtered}
            onOpen={(id) => void open(id)}
            onReset={() => {

              setQuery('');
              void setCategory('all');
              search.current?.focus();

            }}
          />
        </>
      )
    );

  }

  function renderPreviewHeader() {

    return (
      active && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-control border-secondary pb-4">
            <Button
              variant="ghost"
              onClick={async () => {

                if (!(await setSelected('catalog'))) { return; }
                requestAnimationFrame(() => search.current?.focus());

              }}
            >
              <UiIcon name="chevronLeft" className="size-4" />
              {copy.back}
            </Button>
            <div className="flex gap-1">
              <IconButton
                variant="ghost"
                label={copy.previous}
                disabled={position <= 0}
                onClick={() =>
                  void open(componentSpecimens[position - 1].id)
                }
              >
                <UiIcon name="chevronLeft" />
              </IconButton>
              <IconButton
                variant="ghost"
                label={copy.next}
                disabled={position >= componentSpecimens.length - 1}
                onClick={() =>
                  void open(componentSpecimens[position + 1].id)
                }
              >
                <UiIcon name="chevronRight" />
              </IconButton>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h2
              ref={previewHeading}
              tabIndex={-1}
              className="m-0 scroll-mt-24 text-xs font-semibold tracking-wide text-tertiary outline-none"
            >
              {copy.preview}
            </h2>
            <Badge>{copy.categories[active.category]}</Badge>
          </div>
        </>
      )
    );

  }

  function renderPreviewPanel({ id, Preview }: ComponentSpecimen) {

    return (
      <div
        key={id}
        hidden={id !== selected}
        inert={id !== selected}
        className="min-w-0"
      >
        <Preview />
      </div>
    );

  }

  function renderPreviews() {

    const previewPanels = componentSpecimens
      .filter((item) => item.id === selected || visited.includes(item.id))
      .map(renderPreviewPanel);

    return previewPanels;

  }

  return (
    <Page>
      {renderHeader()}
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-8">
        {renderCategories()}
        <div className="grid min-w-0 gap-6">
          {renderCatalog()}
          {renderPreviewHeader()}
          {renderPreviews()}
        </div>
      </div>
    </Page>
  );

}
