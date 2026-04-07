import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { UIStore } from '../../store/ui.store';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const uiStore = inject(UIStore);

  const authReq = req.clone({
    setHeaders: {
      Authorization: 'Bearer my-token',
    },
  });

  uiStore.showLoader();

  return next(authReq).pipe(
    finalize(() => uiStore.hideLoader()) // always hide — success OR error
  );
};
