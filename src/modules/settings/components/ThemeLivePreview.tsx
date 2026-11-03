'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  DataTable,
  Field,
  Input,
  Switch,
  UiIcon,
  Slider,
  ProgressBar,
} from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { strings } from '@/strings';

const copy = strings.designSystem.themeStudio;

export function ThemeLivePreview() {
  const [project, setProject] = useState<string>(copy.projectSample);
  const [notify, setNotify] = useState(true);
  const [brightness, setBrightness] = useState(64);
  const presentation = usePresentationService();

  return (
    <Card className="grid gap-6">
      <div className="grid gap-1">
        <h3 className="m-0 text-lg font-semibold text-primary">
          {copy.liveTitle}
        </h3>
        <p className="m-0 max-w-3xl text-sm text-secondary">{copy.liveHint}</p>
      </div>
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="grid min-w-0 gap-4">
          <Field labelText={copy.projectLabel}>
            <Input
              value={project}
              onChange={(event) => setProject(event.target.value)}
              leadingIcon={<UiIcon name="layers" />}
            />
          </Field>
          <Switch
            label={copy.notifyLabel}
            description={copy.notifyHint}
            checked={notify}
            onChange={(event) => setNotify(event.target.checked)}
          />
          <Slider
            label={strings.valueControls.brightness}
            value={brightness}
            onValueChange={setBrightness}
            leadingIcon={<UiIcon name="sun" className="size-4" />}
            trailingIcon={<UiIcon name="sun" className="size-6" />}
          />
          <ProgressBar
            label={strings.valueControls.download}
            value={brightness}
            size="sm"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                void presentation.showToast({
                  title: copy.toastTitle,
                  description: copy.toastDescription,
                  intent: 'success',
                })
              }
            >
              <UiIcon name="sparkles" />
              {copy.toastAction}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setProject(copy.projectSample);
                setNotify(true);
                setBrightness(64);
              }}
            >
              {copy.resetAction}
            </Button>
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-card border-control border-secondary">
          <DataTable
            embedded
            rows={[...copy.rows]}
            getRowKey={(row) => row.task}
            caption={copy.tableCaption}
            columns={[
              {
                key: 'task',
                header: copy.taskColumn,
                render: (row) => row.task,
              },
              {
                key: 'status',
                header: copy.statusColumn,
                render: (row) => (
                  <Badge intent={row === copy.rows[0] ? 'brand' : 'success'}>
                    {row.status}
                  </Badge>
                ),
              },
              {
                key: 'owner',
                header: copy.ownerColumn,
                render: (row) => row.owner,
              },
            ]}
          />
        </div>
      </div>
    </Card>
  );
}
