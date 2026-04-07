import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export type AlertStatus = 'success' | 'error' | 'warning' | 'info';

export interface AlertMessage {
  text: string;
  status: AlertStatus;
}

export interface UIState {
  loading: boolean;
  activeRequests: number;
  alert: AlertMessage | null;
}

const initialState: UIState = {
  loading: false,
  activeRequests: 0,
  alert: null,
};

let alertTimer: ReturnType<typeof setTimeout> | null = null;

export const UIStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    showLoader(): void {
      patchState(store, (state) => ({
        activeRequests: state.activeRequests + 1,
        loading: true,
      }));
    },

    hideLoader(): void {
      patchState(store, (state) => {
        const activeRequests = Math.max(0, state.activeRequests - 1);
        return {
          activeRequests,
          loading: activeRequests > 0,
        };
      });
    },

    notify(text: string, status: AlertStatus = 'info', duration = 3000): void {
      if (alertTimer) clearTimeout(alertTimer);

      patchState(store, { alert: { text, status } });

      alertTimer = setTimeout(() => {
        patchState(store, { alert: null });
        alertTimer = null;
      }, duration);
    },

    dismissAlert(): void {
      if (alertTimer) clearTimeout(alertTimer);
      patchState(store, { alert: null });
      alertTimer = null;
    },
  }))
);
