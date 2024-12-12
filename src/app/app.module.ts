import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MsalModule, MSAL_INSTANCE, MsalService, MsalInterceptor, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';

// const isIE = window && window.document;

export function MSALInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: '425cae19-a568-407c-a25f-91f7fb243070',  // Substitua pelo seu Client ID do Azure AD
      authority: 'https://login.microsoftonline.com/9d64dfab-644d-4ee5-9620-934b52f48ab5',  // Substitua pelo seu Tenant ID do Azure AD
      redirectUri: 'http://localhost:4200',  // O URL de redirecionamento após login
    },
    cache: {
      cacheLocation: 'localStorage',
      // storeAuthStateInCookie: isIE,  // Para browsers antigos como IE
    },
  });
}

@NgModule({
  declarations: [AppComponent],
  imports: [CommonModule, RouterModule.forRoot(routes), BrowserModule, HttpClientModule, MsalModule],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    MsalService,
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
