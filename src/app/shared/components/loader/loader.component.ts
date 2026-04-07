import { Component, inject } from '@angular/core';
import { UIStore } from '../../../store/ui.store';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (uiStore.loading()) {
      <div class="loader-overlay" aria-live="polite" aria-label="Loading">
        <div class="loader-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <p class="loader-text">Loading...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .loader-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .spinner-ring {
      position: absolute;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 4px solid transparent;
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    .spinner-ring:nth-child(1) {
      border-top-color: #6c63ff;
      animation-delay: -0.45s;
    }
    .spinner-ring:nth-child(2) {
      border-top-color: #3ecfcf;
      animation-delay: -0.3s;
    }
    .spinner-ring:nth-child(3) {
      border-top-color: #ff6b6b;
      animation-delay: -0.15s;
    }

    @keyframes spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loader-text {
      margin-top: 80px;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.08em;
    }
  `],
})
export class LoaderComponent {
  protected uiStore = inject(UIStore);
}
