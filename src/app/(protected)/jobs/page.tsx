import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { portalModules } from '@/config/portalModules';
import { portalJobStrings as copy } from '@/strings';

import { JobsScreen } from '@/modules/background-jobs/JobsScreen';

export const metadata: Metadata = { title: copy.title };

export default function Page() {

  if (!portalModules.backgroundJobs) { notFound(); }
  return <JobsScreen />;

}
