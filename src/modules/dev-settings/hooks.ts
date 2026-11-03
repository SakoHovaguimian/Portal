import { useMutation, useQuery } from '@tanstack/react-query';
import { useServiceContainer } from '@/providers/AppProviders';
import type { DevSettingsCommand } from './models/devSettingsCommand';

export const devSettingsQueryKey = ['dev-settings'] as const;

export function useDevSettings() {

  const { devSettingsService } = useServiceContainer();
  const settingsQuery = useQuery({
    queryKey: devSettingsQueryKey,
    queryFn: ({ signal }) => devSettingsService.read(signal),
    retry: false,
  });

  return settingsQuery;

}

export function useDevSettingsCommand() {

  const { devSettingsService } = useServiceContainer();
  const settingsMutation = useMutation({
    mutationFn: async (command: DevSettingsCommand) => {

      if (command.kind === 'update') {

        const settingsUpdatePromise = devSettingsService.update(command.input);
        return settingsUpdatePromise;

      }
      if (command.kind === 'preset') {
        await devSettingsService.switchPreset(command.preset);
      } else {
        await devSettingsService.reset();
      }
      return { reload: true };

    },
  });

  return settingsMutation;

}
