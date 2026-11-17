'use client';

import { useState } from 'react';

import { CreateMenu } from '@/components/ui';
import type { CreateMenuItem } from '@/components/ui';
import { interactiveComponentStrings as strings } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

const copy = strings.create;
const items = [
  { id: 'document', label: copy.document, icon: 'file' },
  { id: 'spreadsheet', label: copy.spreadsheet, icon: 'table' },
  { id: 'board', label: copy.board, icon: 'grid' },
  { id: 'folder', label: copy.folder, icon: 'folder' },
] as const satisfies readonly CreateMenuItem<string>[];

export function CreateMenuShowcase() {

  const [selection, setSelection] = useState<string>();

  return (
    <ShowcaseSection id="create-menu" title={copy.title} description={copy.description} icon="plus">
      <div className="grid min-h-48 min-w-0 content-start justify-items-start gap-3 rounded-card bg-secondary_subtle p-5">
        <CreateMenu
          items={items}
          onAction={(id) => {

            const item = items.find((entry) => entry.id === id);
            setSelection(item?.label);

          }}
        />
        <p role="status" className="m-0 text-sm text-tertiary">
          {selection && copy.actionMessage(selection)}
        </p>
      </div>
    </ShowcaseSection>
  );

}
