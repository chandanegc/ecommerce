import { Component, inject } from '@angular/core';
import { AlertsService } from '../../../core/service/alerts.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    @if (alerts.alert(); as alert) {
      <div
        class="alert-toast"
        [class]="'alert-toast alert-' + alert.status"
        role="alert"
        aria-live="assertive"
      >
        <span class="alert-icon">{{ iconFor(alert.status) }}</span>
        <span class="alert-text">{{ alert.text }}</span>
        <button class="alert-close" (click)="alerts.dismiss()" aria-label="Dismiss">✕</button>
      </div>
    }
  `,
  styles: [`
    .alert-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 280px;
      max-width: 420px;
      padding: 14px 18px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
      animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: default;
    }

    @keyframes slideIn {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }

    /* Status variants */
    .alert-success { background: #1a7a4a; color: #fff; border-left: 4px solid #4ade80; }
    .alert-error   { background: #7a1a1a; color: #fff; border-left: 4px solid #f87171; }
    .alert-warning { background: #7a5a1a; color: #fff; border-left: 4px solid #fbbf24; }
    .alert-info    { background: #1a4a7a; color: #fff; border-left: 4px solid #60a5fa; }

    .alert-icon { font-size: 18px; flex-shrink: 0; }

    .alert-text { flex: 1; line-height: 1.4; }

    .alert-close {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.7;
      cursor: pointer;
      font-size: 16px;
      padding: 2px 6px;
      border-radius: 4px;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }
    .alert-close:hover { opacity: 1; }
  `],
})
export class AlertComponent {
  protected alerts = inject(AlertsService);

  iconFor(status: string): string {
    const icons: Record<string, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[status] ?? 'ℹ';
  }
}
