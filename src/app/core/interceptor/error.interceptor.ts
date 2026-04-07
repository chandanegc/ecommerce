import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UIStore } from '../../store/ui.store';

function getErrorMessage(err: HttpErrorResponse): string {
  switch (err.status) {
    case 0:
      return 'Network error — please check your connection.';
    case 400:
      return err.error?.message ?? 'Bad request. Please try again.';
    case 401:
      return 'Unauthorized — please login.';
    case 403:
      return 'Access forbidden.';
    case 404:
      return 'Resource not found.';
    case 422:
      return err.error?.message ?? 'Validation error.';
    case 500:
      return 'Server error — please try again later.';
    default:
      return `Unexpected error (${err.status}).`;
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const uiStore = inject(UIStore);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = getErrorMessage(err);
      uiStore.notify(message, 'error', 5000);
      console.error('[HTTP Error]', err);
      return throwError(() => err);
    })
  );
};
