import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { apiInterceptor } from './core/interceptor/api.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // HTTP client with interceptor chain: auth → error handling
    provideHttpClient(withInterceptors([apiInterceptor, errorInterceptor])),
    // Global uncaught error handler (replaces default Angular ErrorHandler)
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideStore(),
  ],
};
