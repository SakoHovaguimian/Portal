import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { portalModules } from '@/config/portalModules';
import { portalJobStrings as copy } from '@/strings';
import { JobDetailScreen } from '@/modules/background-jobs/JobDetailScreen';

export const metadata: Metadata = { title: copy.detailsTitle };

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {

  if (!portalModules.backgroundJobs) { notFound(); }
  const { jobId } = await params;
  if (!z.uuid().safeParse(jobId).success) { notFound(); }
  return <JobDetailScreen jobId={jobId} />;

}
