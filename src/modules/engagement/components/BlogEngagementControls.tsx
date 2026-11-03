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
import {
  PresentationProvider,
  usePresentationService,
} from '@/presentation/PresentationProvider';
function BlogEngagementContent({
  articleId,
  slug,
}: {
  articleId: string;
  slug: string;
}) {
  const actions = usePublicEngagement({ type: 'blog', id: articleId });
  const presentation = usePresentationService();
  const [confirming, setConfirming] = useState(false);
  const busy = actions.pending || confirming;
  const ratingRef = useRef<HTMLDivElement>(null);
  const clearRating = async () => {
    if (busy || actions.data?.rating == null) return;
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
      )
        if (await actions.update({ rating: null }))
          requestAnimationFrame(() =>
            ratingRef.current
              ?.querySelector<HTMLInputElement>('input')
              ?.focus(),
          );
    } finally {
      setConfirming(false);
    }
  };
  return (
    <section
      aria-label={copy.actionsLabel}
      aria-busy={actions.loading || actions.pending}
      className="mx-auto mb-8 grid max-w-3xl gap-3 rounded-xl border-control border-secondary bg-primary p-4"
    >
      {actions.loading ? (
        <InlineLoading message={copy.loading} />
      ) : actions.signedOut ? (
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
      ) : actions.data ? (
        <div className="flex flex-wrap items-center gap-3">
          <ReactionButton
            liked={actions.data.liked}
            label={actions.data.liked ? copy.unlike : copy.like}
            count={actions.data.likeCount}
            countLabel={copy.likeCount(actions.data.likeCount)}
            loading={
              actions.pending && actions.pendingInput?.liked !== undefined
            }
            disabled={busy}
            onClick={() => void actions.update({ liked: !actions.data!.liked })}
          />
          <BookmarkButton
            saved={actions.data.saved}
            savedLabel={copy.unsave}
            variant={actions.data.saved ? 'destructive' : 'secondary'}
            loading={
              actions.pending && actions.pendingInput?.saved !== undefined
            }
            disabled={busy}
            onClick={() => void actions.update({ saved: !actions.data!.saved })}
          >
            {copy.save}
          </BookmarkButton>
          <div ref={ratingRef} className="flex flex-wrap items-end gap-2">
            <StarRating
              value={actions.data.rating}
              label={copy.ratingLabel}
              valueLabel={
                actions.data.rating === null
                  ? copy.noRating
                  : copy.ratingOption(actions.data.rating)
              }
              getOptionLabel={copy.ratingOption}
              busy={actions.pending}
              disabled={confirming}
              onValueChange={(rating) => void actions.update({ rating })}
              onSelectedClick={() => void clearRating()}
            />
            {actions.data.rating !== null && (
              <Button
                variant="destructive"
                disabled={busy}
                loading={
                  actions.pending && actions.pendingInput?.rating === null
                }
                onClick={() => void clearRating()}
              >
                {copy.clearRating}
              </Button>
            )}
          </div>
          <span aria-live="polite" className="sr-only">
            {copy.likeCount(actions.data.likeCount)}
          </span>
        </div>
      ) : null}
      {actions.failure && (
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
      )}
    </section>
  );
}

export function BlogEngagementControls(props: {
  articleId: string;
  slug: string;
}) {
  const [client] = useState(createQueryClient);
  return (
    <QueryClientProvider client={client}>
      <PresentationProvider>
        <BlogEngagementContent key={props.articleId} {...props} />
      </PresentationProvider>
    </QueryClientProvider>
  );
}
