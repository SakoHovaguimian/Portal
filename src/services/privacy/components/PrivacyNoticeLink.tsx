import Link from 'next/link';

import { strings } from '@/strings';

export function PrivacyNoticeLink() {

  return (
    <Link
      href="/privacy"
      className="w-fit rounded-sm text-sm font-semibold text-brand-secondary underline underline-offset-4 hover:text-brand-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      {strings.privacy.noticeTitle}
    </Link>
  );

}
