'use client';
import type { MessagePayload } from 'firebase/messaging';
import type { NotificationStatus } from './models/notificationStatus';
export class DemoNotificationService {
  private enabled = false;
  constructor(private readonly userId: string) {}
  private get preferenceKey() {
    return `portal-demo-push:${this.userId}`;
  }
  async status(): Promise<NotificationStatus> {
    try {
      this.enabled = localStorage.getItem(this.preferenceKey) === 'true';
    } catch {
      /* Use the in-memory preference when storage is unavailable. */
    }
    return this.enabled ? 'demo-enabled' : 'demo';
  }
  async enable(): Promise<NotificationStatus> {
    this.enabled = true;
    try {
      localStorage.setItem(this.preferenceKey, 'true');
    } catch {
      /* Keep the current-session choice. */
    }
    return 'demo-enabled';
  }
  async disable() {
    this.enabled = false;
    try {
      localStorage.removeItem(this.preferenceKey);
    } catch {
      /* Keep the current-session choice. */
    }
  }
  async prepareForLogout() {
    /* Simulated opt-in belongs to this user and survives sign-out. */
  }
  async listen(
    listener: (payload: MessagePayload) => void,
  ): Promise<(() => void) | null> {
    void listener;
    return null;
  }
}
