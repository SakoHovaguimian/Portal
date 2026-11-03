'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, UploadField, type UploadFile } from '@/components/ui';
import { componentExpansionStrings as copy } from '@/strings';
import { ShowcaseSection } from './ShowcaseSection';

function initialFiles(): UploadFile[] {
  return copy.examples.fileNames.map((name, index) => ({
    id: `sample-${index}`,
    name,
    size: (index + 1) * 181248,
    status: 'ready',
    previewUrl: index === 1 ? '/portal-preview.svg' : undefined,
  }));
}
export function UploadsShowcase() {
  const [files, setFiles] = useState<UploadFile[]>(initialFiles);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);
  const start = (id: string, fail = false) => {
    clearTimeout(timers.current.get(id));
    setFiles((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: 'uploading', progress: 0, error: undefined }
          : item,
      ),
    );
    const tick = (progress: number) => {
      setFiles((current) =>
        current.map((item) =>
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
        ),
      );
      if (progress < 100)
        timers.current.set(
          id,
          setTimeout(() => tick(Math.min(100, progress + 25)), 350),
        );
      else timers.current.delete(id);
    };
    timers.current.set(
      id,
      setTimeout(() => tick(25), 350),
    );
  };
  const busy = files.some((item) => item.status === 'uploading');
  const queued = files.filter((item) => item.status === 'ready');
  return (
    <ShowcaseSection
      id="uploads"
      title={copy.examples.uploadTitle}
      description={copy.examples.uploadDescription}
      icon="upload"
    >
      <UploadField
        label={copy.examples.uploadLabel}
        description={copy.examples.uploadHint}
        files={files}
        accept="image/*,.pdf"
        maxFiles={5}
        maxSizeBytes={5 * 1024 * 1024}
        onFiles={(chosen) =>
          setFiles((current) => [
            ...current,
            ...chosen.map((file) => ({
              id: crypto.randomUUID(),
              name: file.name,
              size: file.size,
              file,
              status: 'ready' as const,
            })),
          ])
        }
        onRemove={(id) =>
          setFiles((current) => current.filter((item) => item.id !== id))
        }
        onCancel={(id) => {
          clearTimeout(timers.current.get(id));
          timers.current.delete(id);
          setFiles((current) =>
            current.map((item) =>
              item.id === id ? { ...item, status: 'cancelled' } : item,
            ),
          );
        }}
        onRetry={(id) => start(id)}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={busy || !queued.length}
          onClick={() => queued.forEach((item) => start(item.id))}
        >
          {copy.examples.simulate}
        </Button>
        <Button
          variant="secondary"
          disabled={busy || !queued.length}
          onClick={() => {
            if (queued[0]) start(queued[0].id, true);
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
      <UploadField
        label={copy.examples.disabledUploadLabel}
        files={[]}
        onFiles={() => {}}
        disabled
      />
    </ShowcaseSection>
  );
}
