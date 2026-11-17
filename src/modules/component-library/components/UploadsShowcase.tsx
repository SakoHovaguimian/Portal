'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, UploadField, type UploadFile } from '@/components/ui';
import { componentExpansionStrings as copy } from '@/strings';

import { ShowcaseSection } from './ShowcaseSection';

function initialFiles(): UploadFile[] {

  const files: UploadFile[] = copy.examples.fileNames.map((name, index) => ({
    id: `sample-${index}`,
    name,
    size: (index + 1) * 181248,
    status: 'ready',
    previewUrl: index === 1 ? '/portal-preview.svg' : undefined,
  }));

  return files;

}

export function UploadsShowcase() {

  const [files, setFiles] = useState<UploadFile[]>(initialFiles);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  useEffect(() => {

    const pending = timers.current;
    const cleanup = () => pending.forEach(clearTimeout);
    return cleanup;

  }, []);
  const start = (id: string, fail = false) => {

    clearTimeout(timers.current.get(id));
    setFiles((current) => {

      const updatedFiles: UploadFile[] = current.map((item) =>
        item.id === id
          ? { ...item, status: 'uploading', progress: 0, error: undefined }
          : item,
      );

      return updatedFiles;

    },
    );
    const tick = (progress: number) => {

      setFiles((current) => {

        const updatedFiles: UploadFile[] = current.map((item) =>
          item.id === id
            ? {
              ...item,
              progress,
              status:
                progress === 100
                  ? fail
                    ? 'error'
                    : 'complete'
                  : 'uploading',
              error:
                progress === 100 && fail
                  ? copy.examples.failureHint
                  : undefined,
            }
            : item,
        );

        return updatedFiles;

      },
      );
      if (progress < 100) {

        timers.current.set(
          id,
          setTimeout(() => tick(Math.min(100, progress + 25)), 350),
        );

      } else { timers.current.delete(id); }

    };
    timers.current.set(
      id,
      setTimeout(() => tick(25), 350),
    );

  };
  const busy = files.some((item) => item.status === 'uploading');
  const queued = files.filter((item) => item.status === 'ready');

  function renderUploadQueue() {

    return (
      <UploadField
        label={copy.examples.uploadLabel}
        description={copy.examples.uploadHint}
        files={files}
        accept="image/*,.pdf"
        maxFiles={5}
        maxSizeBytes={5 * 1024 * 1024}
        onFiles={(chosen) => {

          setFiles((current) => {

            const updatedFiles: UploadFile[] = [
              ...current,
              ...chosen.map((file) => ({
                id: crypto.randomUUID(),
                name: file.name,
                size: file.size,
                file,
                status: 'ready' as const,
              })),
            ];

            return updatedFiles;

          });

        }}
        onRemove={(id) => {

          setFiles((current) => {

            const remainingFiles = current.filter((item) => item.id !== id);
            return remainingFiles;

          });

        }}
        onCancel={(id) => {

          clearTimeout(timers.current.get(id));
          timers.current.delete(id);
          setFiles((current) => {

            const updatedFiles: UploadFile[] = current.map((item) =>
              item.id === id ? { ...item, status: 'cancelled' } : item,
            );

            return updatedFiles;

          },
          );

        }}
        onRetry={(id) => start(id)}
      />
    );

  }

  function renderSimulationActions() {

    return (
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={busy || !queued.length}
          onClick={() => {
            queued.forEach((item) => start(item.id));
          }}
        >
          {copy.examples.simulate}
        </Button>
        <Button
          variant="secondary"
          disabled={busy || !queued.length}
          onClick={() => {

            if (queued[0]) { start(queued[0].id, true); }

          }}
        >
          {copy.examples.simulateFailure}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {

            timers.current.forEach(clearTimeout);
            timers.current.clear();
            setFiles(initialFiles());

          }}
        >
          {copy.examples.reset}
        </Button>
      </div>
    );

  }

  function renderDisabledUpload() {

    return (
      <UploadField
        label={copy.examples.disabledUploadLabel}
        files={[]}
        onFiles={() => {}}
        disabled
      />
    );

  }

  return (
    <ShowcaseSection
      id="uploads"
      title={copy.examples.uploadTitle}
      description={copy.examples.uploadDescription}
      icon="upload"
    >
      {renderUploadQueue()}
      {renderSimulationActions()}
      {renderDisabledUpload()}
    </ShowcaseSection>
  );

}
