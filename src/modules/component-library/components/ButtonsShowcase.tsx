'use client';

import { Button, IconButton, UiIcon } from '@/components/ui';
import { usePresentationService } from '@/presentation/PresentationProvider';
import { strings } from '@/strings';
import { ShowcaseSection } from './ShowcaseSection';
import { buttonPreviewStates as states } from '../models/buttonPreviewState';
import type { ButtonRowProps } from '../models/buttonRowProps';

const copy = strings.componentLibrary;
const variants = [
  'primary',
  'secondary',
  'ghost',
  'icon',
  'destructive',
] as const;

export function ButtonsShowcase() {

  const presentation = usePresentationService();

  async function preview(destructive = false) {

    if (
      destructive &&
      !(await presentation.showAlert({
        title: copy.deleteTitle,
        description: copy.deleteHint,
        tone: 'danger',
        confirmLabel: copy.confirmPreview,
        cancelLabel: copy.keepPreview,
      }))
    ) { return; }
    void presentation.showToast({
      title: copy.actionPreview,
      description: copy.actionPreviewHint,
      intent: 'success',
    });

  }

  function renderVariantHeading(variant: (typeof variants)[number]) {

    return (
      <h4
        key={variant}
        className="m-0 text-xs font-semibold text-primary"
      >
        {copy.variants[variant]}
      </h4>
    );

  }

  const variantHeadings = variants.map(renderVariantHeading);

  function renderStateRow(state: (typeof states)[number]) {

    return (
      <ButtonRow key={state} state={state} preview={preview} />
    );

  }

  const stateRows = states.map(renderStateRow);

  return (
    <ShowcaseSection
      id="buttons"
      title={copy.buttons}
      description={copy.buttonsHint}
      icon="bag"
    >
      <div
        role="region"
        aria-label={copy.buttons}
        tabIndex={0}
        className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-brand"
      >
        <div className="grid min-w-3xl grid-cols-[4.5rem_repeat(5,minmax(max-content,1fr))] items-center gap-x-3 gap-y-3 pb-2">
          <span />
          {variantHeadings}
          {stateRows}
        </div>
      </div>
    </ShowcaseSection>
  );

}

function ButtonRow({
  state,
  preview,
}: ButtonRowProps) {

  function renderButtonVariant(variant: (typeof variants)[number]) {

    const props = {
      disabled: state === 'disabled',
      loading: state === 'loading',
      'data-preview-state': state,
      onClick: () => preview(variant === 'destructive'),
    };
    if (variant === 'icon') {

      return (
        <div key={variant} className="flex justify-center">
          <IconButton
            label={copy.buttonExample(
              copy.variants.icon,
              copy.states[state],
            )}
            {...props}
          >
            {state !== 'loading' && <UiIcon name="settings" />}
          </IconButton>
        </div>
      );

    }
    return (
      <Button
        key={variant}
        variant={variant}
        aria-label={copy.buttonExample(
          copy.variants[variant],
          copy.states[state],
        )}
        className="px-3 whitespace-nowrap"
        {...props}
      >
        {variant === 'primary' && state !== 'loading' && (
          <UiIcon name="plus" className="size-4" />
        )}
        {variant === 'secondary' && state !== 'loading' && (
          <UiIcon name="filter" className="size-4" />
        )}
        {variant === 'destructive' && state !== 'loading' && (
          <UiIcon name="trash" className="size-4" />
        )}
        {variant === 'primary'
          ? state === 'loading'
            ? copy.creating
            : copy.create
          : variant === 'secondary'
            ? copy.filter
            : variant === 'ghost'
              ? copy.cancel
              : copy.delete}
      </Button>
    );

  }

  const buttonVariants = variants.map(renderButtonVariant);

  return (
    <>
      <span className="text-xs text-secondary">{copy.states[state]}</span>
      {buttonVariants}
    </>
  );

}
