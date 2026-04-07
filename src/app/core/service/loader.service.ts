import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  /** Tracks number of active HTTP requests */
  private activeRequests = 0;

  /** Public signal — true when any request is in-flight */
  readonly loading = signal<boolean>(false);

  show(): void {
    this.activeRequests++;
    this.loading.set(true);
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.loading.set(false);
    }
  }
}
