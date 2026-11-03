'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/client/queryClient';
import {
  Button,
  InlineLoading,
  Message,
  ReactionButton,
  BookmarkButton,
  StarRating,
} from '@/components/ui';
import { portalEngagementStrings as copy } from '@/strings';
import { usePublicEngagement } from '../usePublicEngagement';
import type { BlogEngagementControlsProps } from '../models/blogEngagementControlsProps';
import {
  PresentationProvider,
  usePresentationService,
} from '@/presentation/PresentationProvider';

function BlogEngagementContent({
  articleId,
  slug,
}: BlogEngagementControlsProps) {

  const actions = usePublicEngagement({ type: 'blog', id: articleId });
  const presentation = usePresentationService();
  const [confirming, setConfirming] = useState(false);
  const busy = actions.pending || confirming;
  const ratingRef = useRef<HTMLDivElement>(null);
  const clearRating = async () => {

    if (busy || actions.data?.rating == null) { return; }
    setConfirming(true);
    try {

      if (
        await presentation.showAlert({
          title: copy.clearRatingTitle,
          description: copy.clearRatingDescription,
          confirmLabel: copy.clearRating,
          cancelLabel: copy.keepRating,
          tone: 'danger',
        })
      ) {

        if (await actions.update({ rating: null })) {

          requestAnimationFrame(() =>
            ratingRef.current
              ?.querySelector<HTMLInputElement>('input')
              ?.focus(),
          );

        }

      }

    } finally {
      setConfirming(false);
    }

  };

  function renderSignIn() {

    return (
      <div className="grid gap-2">
        <p className="m-0 text-sm text-secondary">{copy.signInHint}</p>
        <Button asChild variant="secondary" className="justify-self-start">
          <Link
            href={{
              pathname: '/login',
              query: { redirectTo: `/blog/${slug}` },
            }}
          >
            {copy.signIn}
          </Link>
        </Button>
      </div>
    );

  }

  function renderAccountActions() {

    const data = actions.data;
    if (!data) { return null; }
    return (
      <div className="flex flex-wrap items-center gap-3">
        <ReactionButton
          liked={data.liked}
          label={data.liked ? copy.unlike : copy.like}
          count={data.likeCount}
          countLabel={copy.likeCount(data.likeCount)}
          loading={actions.pending && actions.pendingInput?.liked !== undefined}
          disabled={busy}
          onClick={() => void actions.update({ liked: !data.liked })}
        />
        <BookmarkButton
          saved={data.saved}
          savedLabel={copy.unsave}
          variant={data.saved ? 'destructive' : 'secondary'}
          loading={actions.pending && actions.pendingInput?.saved !== undefined}
          disabled={busy}
          onClick={() => void actions.update({ saved: !data.saved })}
        >
          {copy.save}
        </BookmarkButton>
        <div ref={ratingRef} className="flex flex-wrap items-end gap-2">
          <StarRating
            value={data.rating}
            label={copy.ratingLabel}
            valueLabel={
              data.rating === null
                ? copy.noRating
                : copy.ratingOption(data.rating)
            }
            getOptionLabel={copy.ratingOption}
            busy={actions.pending}
            disabled={confirming}
            onValueChange={(rating) => void actions.update({ rating })}
            onSelectedClick={() => void clearRating()}
          />
          {data.rating !== null && (
            <Button
              variant="destructive"
              disabled={busy}
              loading={actions.pending && actions.pendingInput?.rating === null}
              onClick={() => void clearRating()}
            >
              {copy.clearRating}
            </Button>
          )}
        </div>
        <span aria-live="polite" className="sr-only">
          {copy.likeCount(data.likeCount)}
        </span>
      </div>
    );

  }

  function renderEngagementState() {

    if (actions.loading) { return <InlineLoading message={copy.loading} />; }
    if (actions.signedOut) { return renderSignIn(); }
    return renderAccountActions();

  }

  function renderFailure() {

    if (!actions.failure) { return null; }
    return (
      <>
        <Message
          intent="danger"
          title={copy.errorTitle}
          description={actions.failure}
        />
        <Button
          variant="ghost"
          disabled={actions.pending}
          className="justify-self-start"
          onClick={actions.retry}
        >
          {copy.retry}
        </Button>
      </>
    );

  }

  function renderControls() {

    return (
      <section
        aria-label={copy.actionsLabel}
        aria-busy={actions.loading || actions.pending}
        className="mx-auto mb-8 grid max-w-3xl gap-3 rounded-xl border-control border-secondary bg-primary p-4"
      >
        {renderEngagementState()}
        {renderFailure()}
      </section>
    );

  }

  return renderControls();

}

export function BlogEngagementControls(props: BlogEngagementControlsProps) {

  const [client] = useState(createQueryClient);
  return (
    <QueryClientProvider client={client}>
      <PresentationProvider>
        <BlogEngagementContent key={props.articleId} {...props} />
      </PresentationProvider>
    </QueryClientProvider>
  );

}
