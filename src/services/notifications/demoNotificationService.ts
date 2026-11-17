'use client';
import type { MessagePayload } from 'firebase/messaging';

import type { NotificationStatus } from './models/notificationStatus';

export class DemoNotificationService {

  private enabled = false;
  constructor(private readonly userId: string) {}

  // **************************************
  // MARK: - GET DEMO NOTIFICATION PREFERENCE KEY
  // **************************************

  private get preferenceKey() {
    return `portal-demo-push:${this.userId}`;
  }

  // **************************************
  // MARK: - GET DEMO NOTIFICATION STATUS
  // **************************************

  async status(): Promise<NotificationStatus> {

    try {
      this.enabled = localStorage.getItem(this.preferenceKey) === 'true';
    } catch {
      /* Use the in-memory preference when storage is unavailable. */
    }
    return this.enabled ? 'demo-enabled' : 'demo';

  }

  // **************************************
  // MARK: - ENABLE DEMO NOTIFICATIONS
  // **************************************

  async enable(): Promise<NotificationStatus> {

    this.enabled = true;
    try {
      localStorage.setItem(this.preferenceKey, 'true');
    } catch {
      /* Keep the current-session choice. */
    }
    return 'demo-enabled';

  }

  // **************************************
  // MARK: - DISABLE DEMO NOTIFICATIONS
  // **************************************

  async disable() {

    this.enabled = false;
    try {
      localStorage.removeItem(this.preferenceKey);
    } catch {
      /* Keep the current-session choice. */
    }

  }

  // **************************************
  // MARK: - PREPARE DEMO NOTIFICATIONS FOR LOGOUT
  // **************************************

  async prepareForLogout() {
    /* Simulated opt-in belongs to this user and survives sign-out. */
  }

  // **************************************
  // MARK: - LISTEN FOR DEMO NOTIFICATIONS
  // **************************************

  async listen(
    listener: (payload: MessagePayload) => void,
  ): Promise<(() => void) | null> {

    void listener;
    return null;

  }

}
