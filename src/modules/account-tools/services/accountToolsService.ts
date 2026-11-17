import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { validateInput } from '@/utils/validateInput';

import { accountToolsQueryParams } from '../accountToolsQueryParams';
import {
  AccountDeletionSchema,
  type AccountDeletion,
} from '../models/accountDeletion';
import { AccountDeviceSchema } from '../models/accountDevice';
import {
  AccountDeviceQuerySchema,
  type AccountDeviceQuery,
} from '../models/accountDeviceQuery';
import { accountToolsPageSchema } from '../models/accountToolsPage';
import {
  AccountToolsPagingSchema,
  type AccountToolsPaging,
} from '../models/accountToolsPaging';
import { FrequentlyAskedQuestionsSchema } from '../models/frequentlyAskedQuestions';
import { LegalContextSchema, type LegalContext } from '../models/legalContext';
import {
  LegalInformationSchema,
} from '../models/legalInformation';
import { NotificationDeliverySchema } from '../models/notificationDelivery';
import { NotificationDeliveryAttemptSchema } from '../models/notificationDeliveryAttempt';
import {
  NotificationDeliveryQuerySchema,
  type NotificationDeliveryQuery,
} from '../models/notificationDeliveryQuery';

const accountToolsBasePath = '/portal/account-tools';
const adminAccountToolsBasePath = '/admin/account-tools';

export class AccountToolsService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - DELETE ACCOUNT
  // **************************************

  async deleteAccount(input: AccountDeletion) {

    await this.api.request(`${accountToolsBasePath}/account`, {
      method: 'DELETE',
      body: validateInput(AccountDeletionSchema, input),
    });

  }

  // **************************************
  // MARK: - LIST ACCOUNT DEVICES
  // **************************************

  async devices(query: AccountDeviceQuery, signal?: AbortSignal) {

    return accountToolsPageSchema(AccountDeviceSchema).parse(
      await this.api.request(
        `${accountToolsBasePath}/devices?${accountToolsQueryParams(validateInput(AccountDeviceQuerySchema, query))}`,
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - REMOVE ACCOUNT DEVICE
  // **************************************

  async removeDevice(id: string) {

    await this.api.request(`${accountToolsBasePath}/devices/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

  }

  // **************************************
  // MARK: - LIST NOTIFICATION DELIVERIES
  // **************************************

  async deliveries(query: NotificationDeliveryQuery, signal?: AbortSignal) {

    return accountToolsPageSchema(NotificationDeliverySchema).parse(
      await this.api.request(
        `${adminAccountToolsBasePath}/deliveries?${accountToolsQueryParams(validateInput(NotificationDeliveryQuerySchema, query))}`,
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - LIST DELIVERY ATTEMPTS
  // **************************************

  async deliveryAttempts(
    id: string,
    paging: AccountToolsPaging,
    signal?: AbortSignal,
  ) {

    return accountToolsPageSchema(NotificationDeliveryAttemptSchema).parse(
      await this.api.request(
        `${adminAccountToolsBasePath}/deliveries/${encodeURIComponent(id)}/attempts?${accountToolsQueryParams(validateInput(AccountToolsPagingSchema, paging))}`,
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - GET LEGAL INFORMATION
  // **************************************

  async legal(context: LegalContext, signal?: AbortSignal) {

    return LegalInformationSchema.parse(
      await this.api.request(
        `${accountToolsBasePath}/legal?${accountToolsQueryParams({ context: LegalContextSchema.parse(context) })}`,
        { signal },
      ),
    );

  }

  // **************************************
  // MARK: - GET FREQUENTLY ASKED QUESTIONS
  // **************************************

  async faq(signal?: AbortSignal) {

    return FrequentlyAskedQuestionsSchema.parse(
      await this.api.request(`${accountToolsBasePath}/faq`, { signal }),
    );

  }

}
