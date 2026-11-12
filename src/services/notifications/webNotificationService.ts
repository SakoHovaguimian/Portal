'use client';
import { initializeApp, getApps } from 'firebase/app';
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from 'firebase/messaging';

import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import { strings } from '@/strings';

import type { MessagingConfig } from './models/messagingConfig';
import type { NotificationDisableOptions } from './models/notificationDisableOptions';
import type { NotificationStatus } from './models/notificationStatus';

export class WebNotificationService {

  private token: string | null = null;
  constructor(
    private readonly api: ApiClientInterface,
    private readonly config: MessagingConfig,
    private readonly userId: string
  ) {}

  // **************************************
  // MARK: - GET NOTIFICATION PREFERENCE KEY
  // **************************************

  private get preferenceKey() {
    return `portal-push:${this.userId}`;
  }

  // **************************************
  // MARK: - CHECK BROWSER NOTIFICATION SUPPORT
  // **************************************

  private async supported() {

    return (
      window.isSecureContext &&
      strings.ui.webNotificationService.notification in window &&
      'serviceWorker' in navigator &&
      (await isSupported())
    );

  }

  // **************************************
  // MARK: - GET FIREBASE MESSAGING
  // **************************************

  private messaging() {

    const app =
      getApps().find((app) => app.name === 'portal-messaging') ||
      initializeApp(this.config.firebase, 'portal-messaging');
    return getMessaging(app);

  }

  // **************************************
  // MARK: - GET BROWSER NOTIFICATION STATUS
  // **************************************

  async status(): Promise<NotificationStatus> {

    if (!(await this.supported())) { return 'unsupported'; }
    if (Notification.permission === 'denied') { return 'denied'; }
    return Notification.permission === 'granted' &&
      localStorage.getItem(this.preferenceKey) === 'true'
      ? 'enabled'
      : 'available';

  }

  // **************************************
  // MARK: - ENABLE BROWSER NOTIFICATIONS
  // **************************************

  async enable(): Promise<NotificationStatus> {

    if (!(await this.supported())) { return 'unsupported'; }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') { return permission === 'denied' ? 'denied' : 'available'; }
    await this.register();
    localStorage.setItem(this.preferenceKey, 'true');
    return 'enabled';

  }

  // **************************************
  // MARK: - LISTEN FOR BROWSER NOTIFICATIONS
  // **************************************

  async listen(
    listener: (payload: MessagePayload) => void,
  ): Promise<(() => void) | null> {

    if ((await this.status()) !== 'enabled') { return null; }
    await this.register();
    return onMessage(this.messaging(), listener);

  }

  // **************************************
  // MARK: - PREPARE NOTIFICATIONS FOR LOGOUT
  // **************************************

  async prepareForLogout(): Promise<void> {
    await this.disable({ forgetPreference: false });
  }

  // **************************************
  // MARK: - DISABLE BROWSER NOTIFICATIONS
  // **************************************

  async disable({
    forgetPreference = true,
  }: NotificationDisableOptions = {}): Promise<void> {

    const token =
      this.token || localStorage.getItem(`${this.preferenceKey}:token`);
    if (forgetPreference) { localStorage.removeItem(this.preferenceKey); }
    if (!token || !(await this.supported())) { return; }
    // Revoke the FCM token even if the API is temporarily unavailable.
    try {

      if (token) {

        await this.api.request('/devices/', {
          method: 'DELETE',
          body: { device_token: token },
        });

      }

    } finally {

      await deleteToken(this.messaging());
      this.token = null;
      localStorage.removeItem(`${this.preferenceKey}:token`);

    }

  }

  // **************************************
  // MARK: - REGISTER NOTIFICATION TOKEN
  // **************************************

  private async register() {

    await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });
    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(this.messaging(), {
      vapidKey: this.config.vapidKey,
      serviceWorkerRegistration: registration,
    });
    try {

      await this.api.request('/devices/', {
        method: 'POST',
        body: { device_token: token, device_type: 'Web' },
      });

    } catch (error) {

      await deleteToken(this.messaging()).catch(() => undefined);
      throw error;

    }
    this.token = token;
    localStorage.setItem(`${this.preferenceKey}:token`, token);

  }

}
