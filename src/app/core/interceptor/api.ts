import { HttpInterceptorFn } from '@angular/common/http';

export const api: HttpInterceptorFn = (req, next) => {

  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: 'Bearer my-token'
    }
  });
console.log("Interceptor is working..")
  return next(modifiedReq);
};
