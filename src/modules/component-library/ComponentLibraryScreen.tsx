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
import { componentBrowserStrings as copy } from '@/strings';
import { useUrlState } from '@/providers/useUrlState';
import {
  componentCategories,
  componentIds,
  componentSpecimens,
} from './componentSpecimens';
import { ComponentCatalog } from './components/ComponentCatalog';

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
  const open = async (id: string) => {
    setVisited((current) =>
      current.includes(id) ? current : [...current, id],
    );
    await setSelected(id);
    requestAnimationFrame(() => {
      previewHeading.current?.focus();
      previewHeading.current?.scrollIntoView({ block: 'start' });
    });
  };
  const position = componentSpecimens.findIndex((item) => item.id === selected);
  return (
    <Page>
      <PageHeader
        title={copy.title}
        description={copy.description}
        meta={
          <>
            <Badge intent="brand">{copy.eyebrow}</Badge>
            <span>{copy.results(componentSpecimens.length)}</span>
          </>
        }
      />
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-8">
        <aside className="min-w-0 xl:sticky xl:top-24">
          <div className="sm:hidden">
            <Select
              aria-label={copy.navigation}
              value={category}
              onValueChange={async (next) => {
                const key = componentCategories.find((item) => item === next);
                if (key) {
                  await setCategory(key);
                  await setSelected('catalog');
                }
              }}
            >
              {componentCategories.map((key) => (
                <option key={key} value={key}>
                  {copy.categories[key]}
                </option>
              ))}
            </Select>
          </div>
          <nav
            aria-label={copy.navigation}
            className="hidden min-w-0 flex-wrap gap-1 sm:flex xl:grid"
          >
            {componentCategories.map((key) => (
              <Button
                key={key}
                variant="ghost"
                aria-pressed={category === key}
                className="min-h-11 justify-between gap-3 px-3 text-left aria-pressed:bg-brand-primary aria-pressed:text-brand-secondary"
                onClick={async () => {
                  await setCategory(key);
                  await setSelected('catalog');
                }}
              >
                <span>{copy.categories[key]}</span>
                <span className="text-xs tabular-nums text-tertiary">
                  {key === 'all'
                    ? componentSpecimens.length
                    : componentSpecimens.filter((item) => item.category === key)
                        .length}
                </span>
              </Button>
            ))}
          </nav>
          <div className="mt-6 hidden border-t-control border-secondary px-3 pt-5 xl:block">
            <UiIcon name="code" className="mb-3 size-5 text-tertiary" />
            <p className="m-0 text-xs font-medium text-secondary">
              {copy.localTitle}
            </p>
            <p className="m-0 mt-2 text-xs leading-relaxed text-tertiary">
              {copy.localDescription}
            </p>
          </div>
        </aside>
        <div className="grid min-w-0 gap-6">
          {!active && (
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
          )}
          {active && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-control border-secondary pb-4">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await setSelected('catalog');
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
          )}
          {componentSpecimens
            .filter((item) => item.id === selected || visited.includes(item.id))
            .map(({ id, Preview }) => (
              <div
                key={id}
                hidden={id !== selected}
                inert={id !== selected}
                className="min-w-0"
              >
                <Preview />
              </div>
            ))}
        </div>
      </div>
    </Page>
  );
}
