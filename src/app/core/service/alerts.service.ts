import { Injectable, signal } from '@angular/core';

export type AlertStatus = 'success' | 'error' | 'warning' | 'info';

export interface AlertMessage {
  text: string;
  status: AlertStatus;
}

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  /** Current alert — null means hidden */
  readonly alert = signal<AlertMessage | null>(null);

  private timer: ReturnType<typeof setTimeout> | null = null;

  notify(text: string, status: AlertStatus = 'info', duration = 3000): void {
    // Clear any existing timeout
    if (this.timer) clearTimeout(this.timer);

    this.alert.set({ text, status });

    this.timer = setTimeout(() => {
      this.alert.set(null);
    }, duration);
  }

  dismiss(): void {
    if (this.timer) clearTimeout(this.timer);
    this.alert.set(null);
  }
}
