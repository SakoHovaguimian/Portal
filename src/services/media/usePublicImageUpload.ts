'use client';
import { useEffect, useRef, useState } from 'react';

import { DomainError } from '@/errors/domainErrors';
import { useServiceContainer } from '@/providers/AppProviders';
import { portalMediaStrings as mediaCopy } from '@/strings';

import type { PublicImageUploadOptions } from './models/publicImageUploadOptions';

export function usePublicImageUpload({
  disabled,
  onUploaded,
  onUploadStateChange,
}: PublicImageUploadOptions) {

  const { publicImageService } = useServiceContainer();
  const picker = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const [uploading, setUploading] = useState(false);
  const [failure, setFailure] = useState('');
  useEffect(() => {

    if (uploading || !restoreFocus.current) { return; }
    restoreFocus.current = false;
    if (document.activeElement === document.body) { trigger.current?.focus(); }

  }, [uploading]);
  useEffect(
    () => {

      const cleanup = () => {

        controller.current?.abort();
        controller.current = null;

      };

      return cleanup;

    },
    [],
  );

  async function upload(file?: File) {

    if (!file || disabled || controller.current) { return; }
    const active = new AbortController();
    controller.current = active;
    restoreFocus.current = true;
    setUploading(true);
    onUploadStateChange(true);
    setFailure('');
    try {

      const media = await publicImageService.upload(file, active.signal);
      if (!active.signal.aborted) { onUploaded(media.url); }

    } catch (error) {

      if (!active.signal.aborted) {

        setFailure(
          error instanceof DomainError
            ? error.message
            : mediaCopy.imageUploadErrorHint,
        );

      }

    } finally {

      if (controller.current === active) {

        controller.current = null;
        setUploading(false);
        onUploadStateChange(false);
        if (picker.current) { picker.current.value = ''; }

      }

    }

  }

  const imageUpload = {
    picker,
    trigger,
    uploading,
    failure,
    setFailure,
    clearFailure: () => setFailure(''),
    upload,
    cancel: () => {

      restoreFocus.current = true;
      controller.current?.abort();

    },
  };

  return imageUpload;

}
