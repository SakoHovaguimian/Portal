'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  Card,
  DescriptionList,
  Field,
  FormActions,
  InlineLoading,
  Input,
  Message,
  Page,
  PageHeader,
  QueryBoundary,
  Stepper,
  type StepperStep,
  Switch,
  TimezoneSelect,
} from '@/components/ui';
import { useSessionState } from '@/providers/AppProviders';
import { useProjectRouting } from '@/providers/RuntimeProvider';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { portalOnboardingStrings as copy } from '@/strings';

import { resolveOnboardingRedirect } from '@/modules/auth/sessionClient';
import { useOnboarding, useSaveOnboarding } from './hooks';
import type { OnboardingFormProps } from './models/onboardingFormProps';
import { OnboardingPreferencesSchema } from './models/onboardingPreferences';
import { OnboardingProfileSchema } from './models/onboardingProfile';
import type { OnboardingScreenProps } from './models/onboardingScreenProps';
import type { OnboardingStep } from './models/onboardingStep';
import { onboardingSteps } from './onboardingConfiguration';

export function OnboardingScreen({ redirectTo }: OnboardingScreenProps) {

  const query = useOnboarding();
  return (
    <Page>
      <PageHeader title={copy.title} description={copy.description} />
      <QueryBoundary query={query} loadingFallback={<InlineLoading />}>
        {(progress) => (
          <OnboardingForm
            key={progress.completedAt ?? 'incomplete'}
            progress={progress}
            redirectTo={redirectTo}
          />
        )}
      </QueryBoundary>
    </Page>
  );

}

function OnboardingForm({
  progress,
  redirectTo,
}: OnboardingFormProps) {

  const router = useRouter();
  const routing = useProjectRouting();
  const mutation = useSaveOnboarding();
  const { session, setSession } = useSessionState();
  const [step, setStep] = useState<OnboardingStep>(progress.currentStep);
  const [profile, setProfile] = useState(progress.profile);
  const [preferences, setPreferences] = useState(progress.preferences);
  const [validation, setValidation] = useState<string | null>(null);
  const dirty =
    JSON.stringify(profile) !== JSON.stringify(progress.profile) ||
    JSON.stringify(preferences) !== JSON.stringify(progress.preferences);
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {

    dirtyRef.current = dirty;
    busyRef.current = mutation.isPending;

  }, [dirty, mutation.isPending]);

  useUnsavedFormGuard(dirtyRef, busyRef);
  const selectedStepIndex = onboardingSteps.findIndex(
    (item) => item.key === step,
  );
  const currentProgressStepIndex = onboardingSteps.findIndex(
    (item) => item.key === progress.currentStep,
  );

  async function save() {

    if (mutation.isPending) { return; }
    setValidation(null);
    const parsed =
      step === 'profile'
        ? OnboardingProfileSchema.safeParse(profile)
        : OnboardingPreferencesSchema.safeParse(preferences);
    if (step !== 'review' && !parsed.success) {

      setValidation(parsed.error.issues[0]?.message ?? copy.invalidNameHint);
      const field = parsed.error.issues[0]?.path[0];
      formRef.current
        ?.querySelector<HTMLElement>(
          step === 'profile' ? `input[name="${String(field)}"]` : 'button',
        )
        ?.focus();
      return;

    }
    try {

      const savedProgress = await mutation.mutateAsync(
        step === 'profile'
          ? { step, input: profile }
          : step === 'preferences'
            ? { step, input: preferences }
            : { step: 'review', complete: true },
      );
      setProfile(savedProgress.profile);
      setPreferences(savedProgress.preferences);
      dirtyRef.current = false;
      busyRef.current = false;
      if (step === 'profile' && session) {

        const updatedSession = {
          ...session,
          user: { ...session.user, ...savedProgress.profile },
        };
        setSession(updatedSession);

      }
      if (savedProgress.completedAt) {

        router.replace(resolveOnboardingRedirect(routing, redirectTo));
        router.refresh();
        return;

      }
      setStep(savedProgress.currentStep);
      headingRef.current?.focus();

    } catch {
      /* Preserve profile and preferences after an unsuccessful request. */
    }

  }

  function select(target: OnboardingStep) {

    if (dirty || mutation.isPending) { return; }
    setStep(target);
    setValidation(null);

  }

  function renderCompleted() {

    return (
      <Message
        title={copy.completedTitle}
        description={copy.completedDescription}
        intent="success"
        action={
          <Button
            onClick={() => router.push(resolveOnboardingRedirect(routing, redirectTo))}
          >
            {copy.continue}
          </Button>
        }
      />
    );

  }

  function renderStepper() {

    const steps = onboardingSteps.map<StepperStep<OnboardingStep>>(
      (item, itemIndex) => ({
        key: item.key,
        label: item.title,
        description: item.description,
        state:
        item.key === step
          ? 'current'
          : progress.completedSteps.includes(item.key)
            ? 'complete'
            : 'upcoming',
        stateLabel:
        item.key === step
          ? copy.current
          : progress.completedSteps.includes(item.key)
            ? copy.complete
            : copy.upcoming,
        disabled: dirty || itemIndex > currentProgressStepIndex,
      }),
    );

    return (
      <Stepper
        label={copy.stepperLabel}
        orientation="responsive"
        disabled={mutation.isPending}
        steps={steps}
        onSelect={select}
      />
    );

  }

  function renderProfileFields() {

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field labelText={copy.firstName}>
          <Input
            name="firstName"
            autoComplete="given-name"
            value={profile.firstName}
            disabled={mutation.isPending}
            aria-invalid={Boolean(validation)}
            aria-describedby={validation ? 'onboarding-error' : undefined}
            onChange={(event) =>
              setProfile({ ...profile, firstName: event.target.value })
            }
          />
        </Field>
        <Field labelText={copy.lastName}>
          <Input
            name="lastName"
            autoComplete="family-name"
            value={profile.lastName}
            disabled={mutation.isPending}
            aria-invalid={Boolean(validation)}
            aria-describedby={validation ? 'onboarding-error' : undefined}
            onChange={(event) =>
              setProfile({ ...profile, lastName: event.target.value })
            }
          />
        </Field>
      </div>
    );

  }

  function renderPreferenceFields() {

    return (
      <>
        <Field labelText={copy.timezone}>
          <TimezoneSelect
            value={preferences.timezone}
            disabled={mutation.isPending}
            aria-invalid={Boolean(validation)}
            aria-describedby={validation ? 'onboarding-error' : undefined}
            onValueChange={(timezone) =>
              setPreferences({ ...preferences, timezone })
            }
          />
        </Field>
        <Switch
          label={copy.digest}
          description={copy.digestDescription}
          checked={preferences.emailDigest}
          disabled={mutation.isPending}
          onChange={(event) =>
            setPreferences({
              ...preferences,
              emailDigest: event.target.checked,
            })
          }
        />
      </>
    );

  }

  function renderReview() {

    return (
      <>
        <p className="m-0 text-sm text-secondary">{copy.reviewDescription}</p>
        <DescriptionList
          items={[
            { label: copy.firstName, value: progress.profile.firstName },
            { label: copy.lastName, value: progress.profile.lastName },
            {
              label: copy.timezone,
              value: progress.preferences.timezone,
            },
            {
              label: copy.digest,
              value: progress.preferences.emailDigest
                ? copy.yes
                : copy.no,
            },
          ]}
        />
      </>
    );

  }

  function renderStepFields() {

    if (step === 'profile') {
      return renderProfileFields();
    }
    if (step === 'preferences') {
      return renderPreferenceFields();
    }
    return renderReview();

  }

  function renderFeedback() {

    if (!validation && !mutation.isError) {
      return null;
    }
    return (
      <Message
        id="onboarding-error"
        title={copy.errorTitle}
        description={validation ?? mutation.error?.message}
        intent="danger"
      />
    );

  }

  function renderFormActions() {

    return (
      <FormActions sticky={false} variant="inline">
        {selectedStepIndex > 0 && (
          <Button
            variant="secondary"
            disabled={mutation.isPending || dirty}
            onClick={() => select(onboardingSteps[selectedStepIndex - 1].key)}
          >
            {copy.back}
          </Button>
        )}
        <Button type="submit" loading={mutation.isPending}>
          {step === 'review' ? copy.finish : copy.continue}
        </Button>
      </FormActions>
    );

  }

  function renderFormCard() {

    return (
      <Card>
        <form
          ref={formRef}
          noValidate
          className="grid gap-5"
          onSubmit={(event) => {

            event.preventDefault();
            void save();

          }}
        >
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="m-0 text-lg font-semibold text-primary"
          >
            {onboardingSteps[selectedStepIndex].title}
          </h2>
          {renderStepFields()}
          {renderFeedback()}
          {renderFormActions()}
        </form>
      </Card>
    );

  }

  if (progress.completedAt) {
    return renderCompleted();
  }
  return (
    <div className="grid w-full gap-6">
      {renderStepper()}
      {renderFormCard()}
    </div>
  );

}
