import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../service/loader.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  // Attach auth header
  const authReq = req.clone({
    setHeaders: {
      Authorization: 'Bearer my-token',
    },
  });

  loader.show();

  return next(authReq).pipe(
    finalize(() => loader.hide()) // always hide — success OR error
  );
};
