import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isDevSettingsAvailable } from '@/services/demo/demoRuntime';
import { ComponentLibraryScreen } from '@/modules/component-library/ComponentLibraryScreen';
import { strings } from '@/strings';

export const metadata: Metadata = { title: strings.componentLibrary.title };

export default function ComponentLibraryPage() {

  if (!isDevSettingsAvailable()) { notFound(); }
  return <ComponentLibraryScreen />;

}
