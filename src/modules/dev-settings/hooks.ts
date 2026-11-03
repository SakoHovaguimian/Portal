import { useMutation, useQuery } from '@tanstack/react-query';
import { useServiceContainer } from '@/providers/AppProviders';
import type { DevSettingsCommand } from './models/devSettingsCommand';
export const devSettingsQueryKey = ['dev-settings'] as const;
export function useDevSettings() {
  const { devSettingsService } = useServiceContainer();
  return useQuery({
    queryKey: devSettingsQueryKey,
    queryFn: ({ signal }) => devSettingsService.read(signal),
    retry: false,
  });
}
export function useDevSettingsCommand() {
  const { devSettingsService } = useServiceContainer();
  return useMutation({
    mutationFn: async (command: DevSettingsCommand) => {
      if (command.kind === 'update')
        return devSettingsService.update(command.input);
      if (command.kind === 'preset')
        await devSettingsService.switchPreset(command.preset);
      else await devSettingsService.reset();
      return { reload: true };
    },
  });
}
