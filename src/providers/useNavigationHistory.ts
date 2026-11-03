'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import type { NavigationGuard } from './models/navigationGuard';
import type { NavigationHistoryEntry } from './models/navigationHistoryEntry';
import type { PendingNavigationTraversal } from './models/pendingNavigationTraversal';
import {
  internalNavigationHref,
  readNavigationEntry,
  withNavigationEntry,
} from './navigationHistory';

/**
 * Annotate real entries, never insert sentinel entries. A guarded same-document
 * traversal is restored before its confirmation, then replayed only on acceptance.
 * Cross-document exits remain the browser's beforeunload responsibility.
 */
export function useNavigationHistory(confirmNavigation: NavigationGuard) {

  const router = useRouter();
  const current = useRef<NavigationHistoryEntry | null>(null);
  const acceptedTraversal = useRef(false);

  useEffect(() => {

    let disposed = false;
    let cleanup = () => {};
    // Child effects may run before Next's root History API integration. Install
    // after that flush so cleanup can remove our outer wrapper without leaving
    // a stale provider captured underneath Next's methods.
    queueMicrotask(() => {

      if (disposed) { return; }
      const history = window.history;
      // Next installs its own History API wrappers. Compose with those wrappers.
      const pushState = history.pushState;
      const replaceState = history.replaceState;
      current.current = readNavigationEntry(history.state) ?? {
        session: crypto.randomUUID(),
        index: 0,
      };
      replaceState.call(
        history,
        withNavigationEntry(history.state, current.current),
        '',
      );

      const push: History['pushState'] = function (data, unused, url) {

        const previous = current.current!;
        const entry = { session: previous.session, index: previous.index + 1 };
        pushState.call(history, withNavigationEntry(data, entry), unused, url);
        current.current = entry;

      };
      const replace: History['replaceState'] = function (data, unused, url) {

        replaceState.call(
          history,
          withNavigationEntry(data, current.current!),
          unused,
          url,
        );

      };
      history.pushState = push;
      history.replaceState = replace;

      let pending: PendingNavigationTraversal | null = null;
      const decide = () => {

        if (!pending || pending.deciding) { return; }
        const request = pending;
        request.deciding = true;
        void Promise.resolve(request.permission).then(
          (allowed) => {

            if (disposed || pending !== request) { return; }
            pending = null;
            if (allowed) {

              acceptedTraversal.current = true;
              history.go(request.delta);

            }

          },
          () => {

            if (pending === request) { pending = null; }

          },
        );

      };

      const onPopState = (event: PopStateEvent) => {

        const target = readNavigationEntry(event.state);
        const from = current.current;
        if (!target || !from || target.session !== from.session) {

          // No fabricated entry or bounce prevents a deliberate exit.
          acceptedTraversal.current = false;
          current.current = target ?? {
            session: crypto.randomUUID(),
            index: 0,
          };
          return;

        }
        if (pending) {

          event.stopImmediatePropagation();
          if (target.index !== pending.from.index) {
            history.go(pending.from.index - target.index);
          } else {

            current.current = target;
            decide();

          }
          return;

        }
        if (acceptedTraversal.current) {

          acceptedTraversal.current = false;
          current.current = target;
          return;

        }
        const delta = target.index - from.index;
        if (!delta) { return; }
        const permission = confirmNavigation();
        if (permission === true) {

          current.current = target;
          return;

        }
        // Capture runs before Next's popstate handler, keeping the draft mounted.
        event.stopImmediatePropagation();
        pending = { from, delta, permission, deciding: false };
        history.go(-delta);

      };

      const onClick = (event: MouseEvent) => {

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) { return; }
        const element = event.target instanceof Element ? event.target : null;
        const anchor = element?.closest<HTMLAnchorElement>('a[href]');
        if (
          !anchor ||
          anchor.hasAttribute('download') ||
          (anchor.target && anchor.target !== '_self') ||
          anchor.dataset.navigationGuard === 'managed'
        ) { return; }
        const href = internalNavigationHref(anchor.href);
        if (!href) { return; }
        const destination = new URL(href, window.location.href);
        if (
          destination.pathname === window.location.pathname &&
          destination.search === window.location.search
        ) { return; }
        const permission = confirmNavigation();
        if (permission === true) { return; }
        event.preventDefault();
        event.stopPropagation();
        if (permission !== false) {

          void permission.then((allowed) => {

            if (allowed && !disposed) { router.push(href as Route); }

          });

        }

      };

      window.addEventListener('popstate', onPopState, true);
      document.addEventListener('click', onClick, true);
      cleanup = () => {

        window.removeEventListener('popstate', onPopState, true);
        document.removeEventListener('click', onClick, true);
        if (history.pushState === push) { history.pushState = pushState; }
        if (history.replaceState === replace) { history.replaceState = replaceState; }

      };

    });
    const disposeHistory = () => {

      disposed = true;
      cleanup();

    };

    return disposeHistory;

  }, [confirmNavigation, router]);

  const navigateBack = useCallback(
    async (fallback: string) => {

      const href = internalNavigationHref(fallback);
      if (!href || !(await confirmNavigation())) { return false; }
      const entry = current.current;
      if (entry && entry.index > 0) {

        acceptedTraversal.current = true;
        window.history.back();

      } else {
        router.replace(href as Route);
      }
      return true;

    },
    [confirmNavigation, router],
  );

  return navigateBack;

}
