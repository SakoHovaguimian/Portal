'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';

import type { NavigationLinkProps } from '../models/navigationLinkProps';
import { useNavigationGuard } from '@/providers/NavigationGuardProvider';

export function NavigationLink({
  href,
  beforeNavigate,
  navigate,
  ...props
}: NavigationLinkProps) {

  const router = useRouter();
  const { confirmNavigation } = useNavigationGuard();
  return (
    <Link
      {...props}
      data-navigation-guard="managed"
      href={href as Route}
      onNavigate={(event) => {

        const allowed = beforeNavigate
          ? beforeNavigate(href)
          : confirmNavigation();
        if (typeof allowed !== 'boolean') {

          event.preventDefault();
          void allowed.then((confirmed) => {

            if (confirmed) {

              if (navigate) { navigate(href); } else if (props.replace) { router.replace(href as Route, { scroll: props.scroll }); } else { router.push(href as Route, { scroll: props.scroll }); }

            }

          });

        } else if (!allowed) {
          event.preventDefault();
        } else if (navigate) {

          event.preventDefault();
          navigate(href);

        }
        // Clean forms use Link's own push and prefetch behavior synchronously.

      }}
    />
  );

}
