'use client';

import { useRef, useState, type FormEvent } from 'react';

import { MutationError } from '@/components/MutationError';
import { Button, FormActions, BookmarkButton } from '@/components/ui';
import { Switch } from '@/components/ui/components/Switch';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { portalNotificationInboxStrings as copy } from '@/strings';

import { useSaveNotificationPreferences } from '../hooks';
import { NotificationCategorySchema } from '../models/notificationCategory';
import { NotificationChannelSchema } from '../models/notificationChannel';
import type { NotificationPreference } from '../models/notificationPreference';
import type { NotificationPreferencesEditorProps } from '../models/notificationPreferencesEditorProps';

export function NotificationPreferencesEditor({
  initial,
}: NotificationPreferencesEditorProps) {

  function clonePreferences(preferences: NotificationPreference[]) {

    const clonedPreferences = preferences.map((item) => ({ ...item }));
    return clonedPreferences;

  }

  const [saved, setSaved] = useState(initial);
  const [source, setSource] = useState(initial);
  const [draft, setDraft] = useState(() => clonePreferences(initial));
  const mutation = useSaveNotificationPreferences();
  const presentation = usePresentationService();
  const dirty = useRef(false);
  const busy = useRef(false);
  useUnsavedFormGuard(dirty, busy);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  if (source !== initial) {

    setSource(initial);
    if (!isDirty && !mutation.isPending) {

      setSaved(initial);
      setDraft(clonePreferences(initial));

    }

  }

  function handlePreferenceChange(
    category: NotificationPreference['category'],
    channel: NotificationPreference['channel'],
    enabled: boolean,
  ) {

    const nextPreferences = draft.map((item) =>
      item.category === category && item.channel === channel
        ? { ...item, enabled }
        : item,
    );
    dirty.current = JSON.stringify(nextPreferences) !== JSON.stringify(saved);
    mutation.reset();
    setDraft(nextPreferences);

  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();
    if (busy.current || !isDirty) { return; }
    busy.current = true;
    try {

      const changedPreferences = draft.filter((entry) => {

        const savedPreference = saved.find(
          (item) =>
            item.category === entry.category &&
            item.channel === entry.channel,
        );
        const isChanged = savedPreference?.enabled !== entry.enabled;
        return isChanged;

      });
      const result = await mutation.mutateAsync({
        preferences: changedPreferences,
      });
      setSaved(result);
      setDraft(clonePreferences(result));
      dirty.current = false;
      void presentation.showToast({
        title: copy.savedPreferencesTitle,
        intent: 'success',
      });

    } catch {
      /* Keep each channel choice for retry. */
    } finally {
      busy.current = false;
    }

  }

  function handleDiscard() {

    setSaved(initial);
    setDraft(clonePreferences(initial));
    dirty.current = false;
    mutation.reset();

  }

  function renderChannelSwitch(
    category: NotificationPreference['category'],
    channel: NotificationPreference['channel'],
  ) {

    const matchesPreference = (item: NotificationPreference) =>
      item.category === category && item.channel === channel;
    const preference = draft.find(matchesPreference);
    const checked = preference?.enabled ?? false;
    const disabled = mutation.isPending || !preference;
    return (
      <Switch
        key={channel}
        label={copy.channels[channel]}
        checked={checked}
        disabled={disabled}
        onChange={(event) =>
          handlePreferenceChange(category, channel, event.target.checked)
        }
      />
    );

  }

  function renderChannelSwitches(category: NotificationPreference['category']) {

    const renderChannel = (channel: NotificationPreference['channel']) =>
      renderChannelSwitch(category, channel);
    const channelSwitches = NotificationChannelSchema.options.map(
      renderChannel,
    );
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {channelSwitches}
      </div>
    );

  }

  function renderCategoryFieldset(category: NotificationPreference['category']) {

    return (
      <fieldset
        key={category}
        className="grid min-w-0 gap-3 border-0 px-0 py-5 first:pt-0"
      >
        <legend className="float-left w-full text-base font-semibold text-primary">
          {copy.categories[category]}
        </legend>
        <p className="m-0 clear-both text-sm text-secondary">
          {copy.categoryDescriptions[category]}
        </p>
        {renderChannelSwitches(category)}
      </fieldset>
    );

  }

  function renderPreferenceSections() {

    const preferenceSections = NotificationCategorySchema.options.map(
      renderCategoryFieldset,
    );
    return (
      <div className="grid divide-y divide-secondary">
        {preferenceSections}
      </div>
    );

  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-5">
      {renderPreferenceSections()}
      <MutationError error={mutation.error} />
      <FormActions
        variant="inline"
        sticky={false}
        description={isDirty ? copy.unsavedHint : copy.savedHint}
        live
      >
        <Button
          variant="destructive"
          onClick={handleDiscard}
          disabled={!isDirty || mutation.isPending}
        >
          {copy.discardAction}
        </Button>
        <BookmarkButton
          saved={mutation.isSuccess && !isDirty}
          type="submit"
          loading={mutation.isPending}
          disabled={!isDirty}
        >
          {copy.savePreferencesAction}
        </BookmarkButton>
      </FormActions>
    </form>
  );

}
