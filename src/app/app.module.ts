import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: '425cae19-a568-407c-a25f-91f7fb243070', // Substitua pelo Client ID
          authority: 'https://login.microsoftonline.com/9d64dfab-644d-4ee5-9620-934b52f48ab5', // Substitua pelo Tenant ID
          redirectUri: 'http://localhost:4200', // URL de redirecionamento configurada no Azure
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false,
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read'], // Escopo de acesso
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map()
      }
    ),
  ],
  providers: [MsalService],
  bootstrap: [AppComponent],
})
export class AppModule {}
