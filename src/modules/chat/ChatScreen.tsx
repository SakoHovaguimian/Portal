'use client';
import { useRef, useState } from 'react';
import { useUnsavedFormGuard } from '@/providers/useUnsavedFormGuard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Field,
  Input,
  QueryBoundary,
  Page,
  PageHeader,
} from '@/components/ui';
import { useServiceContainer } from '@/providers/AppProviders';
import { useRealtime } from '@/services/realtime/RealtimeProvider';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { strings } from '@/strings';
export function ChatScreen() {
  const container = useServiceContainer();
  const queryClient = useQueryClient();
  const realtime = useRealtime();
  const { demoMode } = useRuntimeConfig();
  const [message, setMessage] = useState('');
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);
  useUnsavedFormGuard(dirtyRef, busyRef);
  const query = useQuery({
    queryKey: ['chat', 'messages'],
    queryFn: ({ signal }) => container.chatService.listMessages(signal),
    refetchInterval: demoMode || realtime.status === 'offline' ? 5000 : false,
  });
  const mutation = useMutation({
    mutationFn: (value: string) => container.chatService.sendMessage(value),
    onSuccess: async () => {
      dirtyRef.current = false;
      busyRef.current = false;
      setMessage('');
      await queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
    onSettled: () => {
      busyRef.current = false;
    },
  });
  return (
    <Page>
      <PageHeader
        title={strings.chat.title}
        description={strings.chat.description}
      />
      <Card className="grid gap-5">
        <div>
          <p className="mt-2 text-xs text-tertiary" role="status">
            {strings.chat[realtime.status]}
          </p>
        </div>
        <QueryBoundary query={query} retainDataOnError>
          {(messages) => (
            <div
              role="log"
              aria-label={strings.chat.title}
              className="grid max-h-[50vh] gap-3 overflow-y-auto"
            >
              {messages.length === 0 && (
                <p className="text-secondary">{strings.chat.empty}</p>
              )}
              {messages.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border-control border-secondary p-4"
                >
                  <p className="text-sm font-semibold">{item.author}</p>
                  <p className="whitespace-pre-wrap wrap-break-word text-sm text-secondary">
                    {item.message}
                  </p>
                  <time
                    className="text-xs text-tertiary"
                    dateTime={item.createdAt}
                  >
                    {new Date(item.createdAt).toLocaleString('en-US')}
                  </time>
                </article>
              ))}
            </div>
          )}
        </QueryBoundary>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (message.trim() && !busyRef.current) {
              busyRef.current = true;
              mutation.mutate(message);
            }
          }}
          className="grid gap-3"
        >
          <Field labelText={strings.chat.placeholder}>
            <Input
              value={message}
              maxLength={2000}
              disabled={mutation.isPending}
              aria-describedby={
                mutation.isError ? 'chat-compose-error' : undefined
              }
              onChange={(event) => {
                dirtyRef.current = event.target.value.length > 0;
                setMessage(event.target.value);
              }}
            />
          </Field>
          {mutation.isError && (
            <p
              id="chat-compose-error"
              role="alert"
              className="text-sm text-error-primary"
            >
              {strings.chat.failed}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={!message.trim() || mutation.isPending}
              loading={mutation.isPending}
            >
              {strings.chat.send}
            </Button>
            {demoMode && (
              <Button
                type="button"
                variant="secondary"
                onClick={realtime.simulateAlert}
              >
                {strings.chat.simulate}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </Page>
  );
}
