import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError((err) => {
      console.log("API Error:", err);
      alert("Something went wrong!");
      return throwError(() => err);
    })
  );
};
