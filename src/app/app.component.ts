import { Component, Inject, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastConfiguration, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { ApiService } from './api.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { environment } from '../environment/enviroment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  // isAuthenticated = false;
  // data: any;
  isUserLoggedIn: boolean = false;
  private readonly _destroy = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadCastService: MsalBroadcastService
  ) {}

  ngOnInit() {

    this.msalBroadCastService.inProgress$.pipe(
      filter((interactionStatus: InteractionStatus) => 
        interactionStatus == InteractionStatus.None
      ),
      takeUntil(this._destroy)
    ).subscribe(x => {
      this.isUserLoggedIn = this.authService.instance.getAllAccounts().length > 0;
    })


    // this.msalService.instance.handleRedirectPromise().then((response) => {
    //   if (response && response.account) {
    //     this.msalService.instance.setActiveAccount(response.account);
    //     this.isAuthenticated = true;
    //   } else if (this.msalService.instance.getAllAccounts().length > 0) {
    //     this.isAuthenticated = true;
    //   }
    // }).catch((error) => {
    //   console.error('Erro ao processar handleRedirectPromise:', error);
    // });
  }

  // login() {
  //   this.msalService.loginPopup().subscribe({
  //     next: (response) => {
  //       this.isAuthenticated = true;
  //       console.log('Login realizado com sucesso!', response);
  //       this.msalService.instance.setActiveAccount(response.account); // Define a conta ativa
  //     },
  //     error: (error) => {
  //       console.error('Erro no login:', error);
  //     },
  //   });
  // }

  // getProtectedData() {
  //   this.msalService
  //     .acquireTokenSilent({
  //       scopes: ['api://425cae19-a568-407c-a25f-91f7fb243070/access_as_user'], // Substitua pelos escopos configurados no Azure AD
  //     })
  //     .subscribe({
  //       next: (response) => {
  //         const accessToken = response.accessToken;
  //         console.log('Token obtido:', accessToken);

  //         this.apiService.getProtectedData(accessToken).subscribe({
  //           next: (data) => {
  //             this.data = data;
  //             console.log('Dados protegidos recebidos:', data);
  //           },
  //           error: (error) => {
  //             console.error('Erro ao acessar dados protegidos:', error);
  //           },
  //         });
  //       },
  //       error: (error) => {
  //         console.error('Erro ao obter token:', error);
  //       },
  //     });
  // }

  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest)
    } else {
      this.authService.loginRedirect();
    }
  }

  logout() {
    this.authService.logoutRedirect({ postLogoutRedirectUri: environment.postLogoUrl });
    
  }

}
