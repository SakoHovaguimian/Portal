'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, EmptyState, ErrorState, Field, Input } from '@semantic-web/ui';
import { useDeleteFeatureRequest, useFeatureRequest, useUpdateFeatureRequest } from './hooks';

export function FeatureRequestDetailScreen({ featureRequestId }: { featureRequestId: string }) {
  const router = useRouter();
  const { data, isPending, isError, refetch } = useFeatureRequest(featureRequestId);
  const updateMutation = useUpdateFeatureRequest(featureRequestId);
  const deleteMutation = useDeleteFeatureRequest(featureRequestId);
  const [message, setMessage] = useState('');

  if (isPending) {
    return <Card>Loading feature request...</Card>;
  }

  if (isError) {
    return <ErrorState title="Feature request unavailable" description="We could not load this request." onRetry={() => void refetch()} />;
  }

  if (!data) {
    return <EmptyState title="Missing feature request" description="This feature request could not be found." />;
  }

  const currentMessage = message || data.message;

  return (
    <Card>
      <h2>Feature request detail</h2>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await updateMutation.mutateAsync({ message: currentMessage });
          setMessage('');
        }}
        style={{ display: 'grid', gap: '0.75rem' }}
      >
        <Field labelText="Message">
          <Input value={currentMessage} onChange={(event) => setMessage(event.target.value)} />
        </Field>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              await deleteMutation.mutateAsync();
              router.push('/feature-requests');
            }}
          >
            Delete request
          </Button>
        </div>
      </form>
    </Card>
  );
}
