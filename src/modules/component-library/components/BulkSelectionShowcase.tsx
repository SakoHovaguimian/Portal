'use client';

import { useState } from 'react';
import {
  Badge,
  BulkActionBar,
  Button,
  DataTable,
  MobileRecordRow,
} from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { componentExpansionStrings as copy } from '@/strings';
import { ShowcaseSection } from './ShowcaseSection';

const initialRows = copy.examples.people.map((name, index) => ({
  id: String(index),
  name,
  unavailable: index === 4,
}));
export function BulkSelectionShowcase() {

  const [rows, setRows] = useState(initialRows);
  const [keys, setKeys] = useState<string[]>([]);
  const [all, setAll] = useState(false);
  const [archived, setArchived] = useState(0);
  const [failure, setFailure] = useState(false);
  const [busy, setBusy] = useState(false);
  const presentation = usePresentationService();
  const visible = rows.slice(0, 3);
  const count = all
    ? rows.filter((item) => !item.unavailable).length
    : keys.length;
  const clear = () => {

    setKeys([]);
    setAll(false);
    setFailure(false);

  };
  const archive = async () => {

    if (busy || !count) { return; }
    setBusy(true);
    try {

      const confirmed = await presentation.showAlert({
        title: copy.examples.archiveTitle,
        description: copy.examples.archiveDescription(count),
        confirmLabel: copy.examples.archive,
        cancelLabel: copy.examples.cancel,
        tone: 'danger',
      });
      if (!confirmed) { return; }
      const targets = all
        ? rows.filter((item) => !item.unavailable).map((item) => item.id)
        : keys;
      setRows((current) => {

        const remainingRows = current.filter((item) => !targets.includes(item.id));
        return remainingRows;

      },
      );
      setArchived((current) => current + targets.length);
      clear();

    } finally {
      setBusy(false);
    }

  };

  function renderBulkActions() {

    return (
      <BulkActionBar
        selectedCount={count}
        totalCount={rows.filter((item) => !item.unavailable).length}
        scope={all ? 'all' : 'page'}
        busy={busy}
        onClear={clear}
        onSelectAllResults={() => {

          setAll(true);
          setKeys(
            rows.filter((item) => !item.unavailable).map((item) => item.id),
          );

        }}
        error={failure ? copy.examples.partialFailureHint : undefined}
      >
        <Button
          variant="destructive"
          disabled={!count || busy}
          onClick={() => void archive()}
        >
          {copy.examples.archive}
        </Button>
        <Button
          variant="secondary"
          disabled={count < 2 || busy}
          onClick={() => {

            const targets = all
              ? rows.filter((item) => !item.unavailable).map((item) => item.id)
              : keys;
            const remaining = targets.slice(0, 1);
            const succeeded = targets.slice(1);
            setRows((current) => {

              const remainingRows = current.filter((item) => !succeeded.includes(item.id));
              return remainingRows;

            },
            );
            setKeys(remaining);
            setAll(false);
            setArchived((current) => current + succeeded.length);
            setFailure(true);

          }}
        >
          {copy.examples.partialFailure}
        </Button>
      </BulkActionBar>
    );

  }

  function renderTable() {

    return (
      <DataTable
        rows={visible}
        getRowKey={(row) => row.id}
        caption={copy.examples.selectionTitle}
        selection={{
          selectedKeys: keys,
          onSelectionChange: (next) => {

            setKeys(next);
            setAll(false);
            setFailure(false);

          },
          getRowLabel: (row) => copy.table.selectRow(row.name),
          isRowDisabled: (row) => row.unavailable,
          disabled: busy,
        }}
        renderMobileRow={(row) => (
          <MobileRecordRow
            title={row.name}
            description={copy.examples.memberRole}
          />
        )}
        columns={[
          {
            key: 'name',
            header: copy.examples.nameColumn,
            render: (row) => row.name,
          },
          {
            key: 'role',
            header: copy.examples.roleColumn,
            render: (row) =>
              row.unavailable
                ? copy.examples.disabledRole
                : copy.examples.memberRole,
          },
          {
            key: 'status',
            header: copy.examples.statusColumn,
            render: () => (
              <Badge intent="success">{copy.avatar.statuses.online}</Badge>
            ),
          },
        ]}
      />
    );

  }

  function renderSummary() {

    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="m-0 text-xs text-tertiary">
          {copy.examples.archived(archived)}
        </p>
        <Button
          variant="ghost"
          disabled={busy}
          onClick={() => {

            clear();
            setRows(initialRows);
            setArchived(0);

          }}
        >
          {copy.examples.reset}
        </Button>
      </div>
    );

  }

  return (
    <ShowcaseSection
      id="bulk"
      title={copy.examples.selectionTitle}
      description={copy.examples.selectionDescription}
      icon="table"
    >
      {renderBulkActions()}
      {renderTable()}
      {renderSummary()}
    </ShowcaseSection>
  );

}
