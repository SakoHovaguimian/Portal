'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useServiceContainer } from '@/providers/AppProviders';

import type { AccountDeletion } from './models/accountDeletion';
import type { AccountDeviceQuery } from './models/accountDeviceQuery';
import type { AccountToolsPaging } from './models/accountToolsPaging';
import type { LegalContext } from './models/legalContext';
import type { NotificationDeliveryQuery } from './models/notificationDeliveryQuery';
import { accountToolsQueryKeys as keys } from './queryKeys';

export function useAccountDevices(query: AccountDeviceQuery) {

  const { accountToolsService: service } = useServiceContainer();
  const devicesQuery = useQuery({
    queryKey: keys.devices(query),
    queryFn: ({ signal }) => service.devices(query, signal),
  });

  return devicesQuery;

}

export function useNotificationDeliveries(query: NotificationDeliveryQuery) {

  const { accountToolsService: service } = useServiceContainer();
  const deliveriesQuery = useQuery({
    queryKey: keys.deliveries(query),
    queryFn: ({ signal }) => service.deliveries(query, signal),
  });

  return deliveriesQuery;

}

export function useDeliveryAttempts(id: string, paging: AccountToolsPaging) {

  const { accountToolsService: service } = useServiceContainer();
  const deliveryAttemptsQuery = useQuery({
    queryKey: keys.attempts(id, paging),
    queryFn: ({ signal }) => service.deliveryAttempts(id, paging, signal),
  });

  return deliveryAttemptsQuery;

}

export function useLegalInformation(context: LegalContext) {

  const { accountToolsService: service } = useServiceContainer();
  const legalInformationQuery = useQuery({
    queryKey: keys.legal(context),
    queryFn: ({ signal }) => service.legal(context, signal),
  });

  return legalInformationQuery;

}

export function useFrequentlyAskedQuestions() {

  const { accountToolsService: service } = useServiceContainer();
  const faqQuery = useQuery({
    queryKey: keys.faq,
    queryFn: ({ signal }) => service.faq(signal),
  });

  return faqQuery;

}

function useAccountToolsMutation<T, R>(mutationFn: (input: T) => Promise<R>) {

  const cache = useQueryClient();
  const accountToolsMutation = useMutation({
    mutationFn,
    onSuccess: () => cache.invalidateQueries({ queryKey: keys.all }),
  });

  return accountToolsMutation;

}

export function useRemoveAccountDevice() {

  const { accountToolsService: service } = useServiceContainer();
  const removeDeviceMutation = useAccountToolsMutation(
    (id: string) => service.removeDevice(id),
  );

  return removeDeviceMutation;

}

export function useDeleteAccount() {

  const { accountToolsService: service } = useServiceContainer();
  const deleteAccountMutation = useMutation({
    mutationFn: (input: AccountDeletion) => service.deleteAccount(input),
    retry: false,
  });

  return deleteAccountMutation;

}
