import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServiceContainer, useSessionState } from '@/providers/AppProviders';
import type { OnboardingUpdate } from './models/onboardingUpdate';
export const onboardingQueryKey = ['onboarding'] as const;
export function useOnboarding(enabled = true) {
  const { onboardingService } = useServiceContainer();
  const { session } = useSessionState();
  return useQuery({
    queryKey: [...onboardingQueryKey, session?.user.id],
    queryFn: ({ signal }) => onboardingService.read(signal),
    enabled: enabled && Boolean(session),
    retry: false,
  });
}
export function useSaveOnboarding() {
  const { onboardingService } = useServiceContainer();
  const queryClient = useQueryClient();
  const { session } = useSessionState();
  return useMutation({
    mutationFn: (input: OnboardingUpdate) => onboardingService.save(input),
    onSuccess: (data) => {
      queryClient.setQueryData([...onboardingQueryKey, session?.user.id], data);
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
