import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { AlertsService } from '../service/alerts.service';

/**
 * GlobalErrorHandler catches all uncaught JavaScript errors and
 * Angular lifecycle errors that aren't caught by the HTTP interceptor.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Use inject() for lazy injection (avoids circular dependency with NgZone)
  private alerts = inject(AlertsService);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    const message = this.extractMessage(error);

    // Run inside NgZone so signal updates trigger change detection
    this.zone.run(() => {
      this.alerts.notify(message, 'error', 6000);
    });

    // Always re-log to console for debugging
    console.error('[GlobalErrorHandler]', error);
  }

  private extractMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message || 'An unexpected error occurred.';
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred.';
  }
}
