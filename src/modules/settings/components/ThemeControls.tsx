'use client';

import { useId, useRef, useState } from 'react';

import { Badge, Field, Radio, Select, SegmentedTabs } from '@/components/ui';
import { ThemeModeSchema, type ThemeMode } from '@/models/appearance';
import { useMotionPreference } from '@/providers/MotionPreferenceProvider';
import { useThemePreference } from '@/providers/ThemePreferenceProvider';
import { strings } from '@/strings';
import { themeCatalog } from '@/themes';

import { ThemeLivePreview } from './ThemeLivePreview';
import { ThemePreview } from './ThemePreview';
import styles from './ThemeStudio.module.css';
import type { ThemeModeOption } from '../models/themeModeOption';

const copy = strings.designSystem;
const motionValues = { system: 'system', reduced: 'reduced' } as const;
const themeModeOptions: ThemeModeOption[] = [
  {
    value: ThemeModeSchema.enum.light,
    label: strings.ui.appearanceScreen.light,
  },
  { value: ThemeModeSchema.enum.dark, label: strings.ui.appearanceScreen.dark },
];

export function ThemeControls() {

  const theme = useThemePreference();
  const motion = useMotionPreference();
  const groupId = useId();
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [error, setError] = useState('');

  async function save(action: () => Promise<void>) {

    if (pendingRef.current) { return; }
    pendingRef.current = true;
    setPending(true);
    setError('');
    try {
      await action();
    } catch {
      setError(copy.preferenceFailedHint);
    } finally {

      pendingRef.current = false;
      setPending(false);

    }

  }

  function renderThemeChoice({ id }: (typeof themeCatalog)[number]) {

    const themeCopy = copy.themeStudio.themes[id];

    function saveThemeChoice() {
      return theme.setThemeId(id);
    }

    function handleThemeChange() {
      void save(saveThemeChoice);
    }

    return (
      <Radio
        key={id}
        name={groupId}
        value={id}
        checked={theme.themeId === id}
        aria-disabled={pending || undefined}
        className={styles.choice}
        onChange={handleThemeChange}
        label={
          <span className={styles.choiceLabel}>
            <ThemePreview themeId={id} mode={theme.mode} />
            <span className={styles.choiceDetails}>
              <span className={styles.choiceName}>{themeCopy.name}</span>
              <span className={styles.choiceDescription}>
                {themeCopy.description}
              </span>
            </span>
          </span>
        }
      />
    );

  }

  function renderThemeChoices() {

    const themeChoices = themeCatalog.map(renderThemeChoice);

    return (
      <div
        role="radiogroup"
        aria-label={copy.themeStudio.themeGroup}
        className={styles.choices}
      >
        {themeChoices}
      </div>
    );

  }

  function renderPreferenceSummary() {

    return (
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <h3 className="m-0 text-base font-semibold text-primary">
            {copy.themeStudio.preferencesTitle}
          </h3>
          <p className="m-0 text-sm text-secondary">
            {copy.themeStudio.preferencesHint}
          </p>
        </div>
        <span role="status" aria-live="polite" aria-atomic="true">
          <Badge intent="brand" dot>
            {copy.themeStudio.selectedTheme(
              copy.themeStudio.themes[theme.themeId].name,
            )}
          </Badge>
        </span>
      </div>
    );

  }

  function handleModeChange(mode: ThemeMode) {

    function saveModePreference() {

      return theme.setPreference({
        mode,
        themeId: theme.themeId,
      });

    }

    void save(saveModePreference);

  }

  function handleMotionPreferenceChange(value: string) {

    const preference = value === 'reduced' ? 'reduced' : 'system';

    function saveMotionPreference() {
      return motion.setPreference(preference);
    }

    void save(saveMotionPreference);

  }

  function renderPreferenceControls() {

    return (
      <div className="grid min-w-0 items-end gap-5 sm:grid-cols-2">
        <div className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-secondary">
            {copy.mode}
          </span>
          <SegmentedTabs
            tabs={themeModeOptions}
            label={copy.mode}
            value={theme.mode}
            disabled={pending}
            onValueChange={handleModeChange}
          />
        </div>
        <Field labelText={copy.motion}>
          <Select
            value={motion.preference}
            disabled={pending}
            onValueChange={handleMotionPreferenceChange}
          >
            <option value={motionValues.system}>{copy.systemMotion}</option>
            <option value={motionValues.reduced}>{copy.reducedMotion}</option>
          </Select>
        </Field>
      </div>
    );

  }

  function renderPreferenceFeedback() {

    return (
      <>
        <p className="m-0 text-sm text-tertiary">{copy.motionHint}</p>
        {error && (
          <p role="alert" className="m-0 text-sm text-error-primary">
            {error}
          </p>
        )}
      </>
    );

  }

  function renderContent() {

    return (
      <div
        className={`${styles.studio} grid min-w-0 gap-6`}
        aria-busy={pending}
      >
        {renderThemeChoices()}
        {renderPreferenceSummary()}
        {renderPreferenceControls()}
        {renderPreferenceFeedback()}
        <ThemeLivePreview />
      </div>
    );

  }

  return renderContent();

}
