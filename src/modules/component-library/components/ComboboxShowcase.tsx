'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Combobox, type ComboboxOption } from '@/components/ui';
import { componentExpansionStrings as copy } from '@/strings';
import { ShowcaseSection } from './ShowcaseSection';

const options: ComboboxOption[] = copy.examples.people.map((label, index) => ({
  id: String(index),
  label,
  description:
    index === 4 ? copy.examples.disabledRole : copy.examples.memberRole,
  disabled: index === 4,
}));
export function ComboboxShowcase() {
  const [value, setValue] = useState<string | null>(null);
  const [remote, setRemote] = useState<string | null>(null);
  const [results, setResults] = useState(options);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestQuery = useRef('');
  useEffect(() => () => clearTimeout(timer.current), []);
  const search = (query: string) => {
    latestQuery.current = query;
    clearTimeout(timer.current);
    setFailure(false);
    setLoading(true);
    timer.current = setTimeout(() => {
      setResults(
        options.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        ),
      );
      setLoading(false);
    }, 650);
  };
  return (
    <ShowcaseSection
      id="combobox"
      title={copy.examples.comboTitle}
      description={copy.examples.comboDescription}
      icon="search"
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="grid gap-3">
          <Combobox
            label={copy.examples.assignee}
            placeholder={copy.examples.assigneePlaceholder}
            options={options}
            value={value}
            onValueChange={setValue}
          />
          <p role="status" className="m-0 text-xs text-tertiary">
            {value
              ? copy.examples.selectedPerson(
                  options.find((item) => item.id === value)?.label ?? '',
                )
              : copy.examples.unassigned}
          </p>
        </div>
        <div className="grid gap-3">
          <Combobox
            label={copy.examples.remoteLabel}
            description={copy.examples.remoteHint}
            placeholder={copy.examples.assigneePlaceholder}
            options={results}
            value={remote}
            onValueChange={setRemote}
            onSearchChange={search}
            loading={loading}
            error={failure ? copy.examples.remoteError : undefined}
            onRetry={() => search(latestQuery.current)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              clearTimeout(timer.current);
              setLoading(false);
              setResults([]);
              setFailure(true);
            }}
          >
            {copy.examples.failSearch}
          </Button>
        </div>
        <Combobox
          label={copy.examples.disabledLabel}
          options={options}
          value={options[0].id}
          onValueChange={() => {}}
          disabled
        />
        <Combobox
          label={copy.examples.readonlyLabel}
          options={options}
          value={options[1].id}
          onValueChange={() => {}}
          readOnly
        />
      </div>
    </ShowcaseSection>
  );
}
