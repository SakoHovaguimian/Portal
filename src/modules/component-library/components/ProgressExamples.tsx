'use client';

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Message,
  Meter,
  ProgressBar,
  ProgressRing,
  Skeleton,
} from '@/components/ui';
import { strings } from '@/strings';

const copy = strings.valueControls;

export function ProgressExamples() {

  const [progress, setProgress] = useState(42);
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const active = running && progress < 100 && !failed;
  useEffect(() => {

    if (!active) { return; }
    const timer = setTimeout(
      () => {
        setProgress((value) => Math.min(value + 4, 100));
      },
      350,
    );
    const cleanup = () => clearTimeout(timer);
    return cleanup;

  }, [active, progress]);

  function renderProgressIndicators() {

    return (
      <div className="grid min-w-0 gap-10">
        <div className="grid min-w-0 max-w-2xl gap-4">
          <ProgressBar
            label={copy.upload}
            value={progress}
            tone={failed ? 'danger' : progress === 100 ? 'success' : 'brand'}
            description={failed ? copy.failedHint : copy.uploadHint}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={progress === 100 || failed}
              onClick={() => {
                setRunning((value) => !value);
              }}
            >
              {active ? copy.pause : copy.run}
            </Button>
            <Button
              variant="secondary"
              disabled={failed || progress === 100}
              onClick={() => {

                setFailed(true);
                setRunning(false);

              }}
            >
              {copy.simulateFailure}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {

                setRunning(false);
                setFailed(false);
                setProgress(0);

              }}
            >
              {copy.reset}
            </Button>
          </div>
          {failed && (
            <Message
              intent="danger"
              title={copy.failed}
              description={copy.failedHint}
              action={
                <Button
                  variant="secondary"
                  onClick={() => {

                    setFailed(false);
                    setRunning(true);

                  }}
                >
                  {copy.retry}
                </Button>
              }
            />
          )}
        </div>
        <div className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] items-start gap-x-10 gap-y-8">
          <ProgressBar label={copy.processing} indeterminate size="sm" />
          <ProgressBar
            label={copy.complete}
            value={100}
            tone="success"
            size="lg"
          />
          <ProgressBar label={copy.paused} value={28} tone="warning" />
          <Meter
            label={copy.storage}
            value={72}
            tone="warning"
            description={copy.storageHint}
          />
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-x-12 gap-y-6">
          <ProgressRing label={copy.download} value={progress} />
          <ProgressRing label={copy.processing} indeterminate size="sm" />
        </div>
      </div>
    );

  }

  function renderLoadingIndicators() {

    return (
      <div className="grid min-w-0 gap-5 border-t border-secondary pt-8">
        <h3 className="m-0 text-base font-semibold text-primary">
          {copy.loadingTitle}
        </h3>
        <div className="flex flex-wrap items-center gap-6">
          <ActivityIndicator label={copy.activity} size="sm" />
          <ActivityIndicator label={copy.activity} showLabel />
          <ActivityIndicator label={copy.activity} size="lg" tone="brand" />
        </div>
        <div
          className="flex max-w-md items-center gap-4"
          aria-busy="true"
          aria-label={copy.activity}
        >
          <Skeleton shape="circle" className="shrink-0" />
          <div className="grid w-full gap-3">
            <Skeleton width="65%" />
            <Skeleton />
            <Skeleton width="85%" />
          </div>
        </div>
        <p className="m-0 text-xs text-tertiary">{copy.skeletonHint}</p>
      </div>
    );

  }

  return (
    <div className="grid min-w-0 gap-6 border-t border-secondary pt-8">
      <h3 className="m-0 text-base font-semibold text-primary">
        {copy.progressTitle}
      </h3>
      {renderProgressIndicators()}
      {renderLoadingIndicators()}
    </div>
  );

}
