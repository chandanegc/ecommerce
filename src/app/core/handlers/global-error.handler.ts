import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { UIStore } from '../../store/ui.store';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private uiStore = inject(UIStore);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    const message = this.extractMessage(error);

    // Run inside NgZone so signal updates trigger change detection
    this.zone.run(() => {
      this.uiStore.notify(message, 'error', 6000);
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
