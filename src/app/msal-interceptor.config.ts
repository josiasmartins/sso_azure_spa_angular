import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalInterceptor, MsalInterceptorConfiguration } from '@azure/msal-angular';

export function MSALInterceptorConfigFactory() {
  return {
    interceptors: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true,
      },
    ],
  };
}
