'use client';

import type { ReviewedDraftAssistantProps } from '../models/reviewedDraftAssistantProps';
import { useReviewedDraftAssistant } from '../useReviewedDraftAssistant';
import { strings } from '@/strings';

import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Field } from './Field';
import { FloatingAssistant } from './FloatingAssistant';
import { Message } from './Message';
import { TextArea } from './TextArea';

export function ReviewedDraftAssistant({
  id,
  title,
  description,
  fields,
  contextKey,
  disabled,
  generate,
  onApply,
  onBusyChange,
  questionsLabel,
  warningsLabel,
  rateLimited,
  transcriptPlaceholder,
}: ReviewedDraftAssistantProps) {

  const {
    transcript,
    transcriptRef,
    changeTranscript,
    result,
    resultRef,
    review,
    selected,
    setReview,
    setSelected,
    pending,
    error,
    speech,
    speechBusy,
    stale,
    canApply,
    startDictation,
    run,
    apply,
    discard,
  } = useReviewedDraftAssistant({
    fields,
    contextKey,
    disabled,
    generate,
    onApply,
    onBusyChange,
    rateLimited,
  });
  const copy = strings.draftAssistant;
  const blocked = disabled || pending || speechBusy;

  function renderDictation() {

    return (
      <div className="grid gap-2">
        <p className="m-0 text-sm font-semibold text-primary">{copy.voice}</p>
        <p className="m-0 text-xs text-tertiary">{copy.voiceHint}</p>
        {speech.isSupported ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={disabled || pending || speech.isFinalizingTranscript}
              onClick={
                speech.isStarting || speech.isListening
                  ? () => void speech.stop()
                  : startDictation
              }
            >
              {speech.isStarting
                ? copy.cancelDictation
                : speech.isListening
                  ? copy.stopDictation
                  : copy.startDictation}
            </Button>
          </div>
        ) : (
          <p className="m-0 text-xs text-secondary">{copy.typedInputHint}</p>
        )}
        {speechBusy && (
          <p role="status" className="m-0 text-sm text-secondary">
            {speech.isFinalizingTranscript
              ? copy.finishing
              : speech.isStarting
                ? copy.starting
                : copy.listeningHint}
          </p>
        )}
        {speech.error && <Message intent="warning" title={speech.error} />}
      </div>
    );

  }

  function renderTranscriptField() {

    return (
      <Field labelText={copy.transcript}>
        <TextArea
          ref={transcriptRef}
          value={transcript}
          maxLength={20000}
          rows={5}
          className="resize-none"
          placeholder={transcriptPlaceholder}
          disabled={blocked}
          aria-describedby={`${id}-transcript-help`}
          onChange={(event) => changeTranscript(event.target.value)}
        />
      </Field>
    );

  }

  function renderGenerationActions() {

    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          loading={pending}
          disabled={blocked || !transcript.trim() || transcript.length > 20000}
          onClick={() => void run()}
        >
          {copy.generate}
        </Button>
        {(transcript || result) && (
          <Button
            variant="secondary"
            disabled={pending || speechBusy}
            onClick={discard}
          >
            {copy.discard}
          </Button>
        )}
      </div>
    );

  }

  function renderFailure() {

    return (
      error && <Message intent="danger" title={error} />
    );

  }

  function renderReview() {

    if (!result) {
      return null;
    }

    const reviewResult = result;

    function renderReviewField(field: (typeof fields)[number]) {

      return (
        <div key={field.key} className="grid min-w-0 gap-2">
          <Checkbox
            label={field.label}
            checked={Boolean(selected[field.key])}
            disabled={blocked || stale}
            onChange={(event) => {

              setSelected((current) => ({
                ...current,
                [field.key]: event.target.checked,
              }));

            }}
          />
          <TextArea
            aria-label={field.label}
            value={review[field.key]}
            maxLength={field.maxLength}
            rows={field.rows ?? 2}
            className="resize-none"
            disabled={blocked || stale}
            onChange={(event) => {

              setReview((current) => ({
                ...current,
                [field.key]: event.target.value,
              }));

            }}
          />
        </div>
      );

    }

    const reviewFields = fields
      .filter((field) => field.key in review)
      .map(renderReviewField);

    function renderQuestions() {

      if (!(reviewResult.questions?.length)) {
        return null;
      }

      function renderQuestion(question: string, index: number) {

        return (
          <li key={index}>{question}</li>
        );

      }

      const questions = reviewResult.questions.map(renderQuestion);

      return (
        <div className="grid gap-2">
          <p className="m-0 text-sm font-semibold text-primary">
            {questionsLabel}
          </p>
          <ul className="m-0 grid gap-2 pl-5 text-sm text-secondary">
            {questions}
          </ul>
        </div>
      );

    }

    function renderWarnings() {

      if (!(reviewResult.warnings?.length)) {
        return null;
      }

      function renderWarning(warning: string, index: number) {

        return (
          <li key={index}>{warning}</li>
        );

      }

      const warnings = reviewResult.warnings.map(renderWarning);

      return (
        <div className="grid gap-2">
          <p className="m-0 text-sm font-semibold text-primary">
            {warningsLabel}
          </p>
          <ul className="m-0 grid gap-2 pl-5 text-sm text-secondary">
            {warnings}
          </ul>
        </div>
      );

    }

    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        className="grid min-w-0 gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <p className="m-0 text-sm text-secondary">{copy.reviewHint}</p>
        {reviewFields}
        {!Object.keys(review).length && (
          <Message intent="info" title={copy.noSuggestionsHint} />
        )}
        {renderQuestions()}
        {renderWarnings()}
        {stale && <Message intent="warning" title={copy.changedHint} />}
        <div className="flex flex-wrap gap-2">
          <Button disabled={blocked || stale || !canApply} onClick={apply}>
            {copy.apply}
          </Button>
        </div>
      </div>
    );

  }

  return (
    <FloatingAssistant
      id={id}
      title={title}
      description={description}
      disabled={disabled}
      busy={pending || speechBusy}
    >
      {renderDictation()}
      {renderTranscriptField()}
      <p id={`${id}-transcript-help`} className="m-0 text-xs text-tertiary">
        {copy.transcriptHint}
      </p>
      {renderGenerationActions()}
      {renderFailure()}
      {renderReview()}
    </FloatingAssistant>
  );

}
