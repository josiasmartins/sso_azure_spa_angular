import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Bem-vindo!</h1>
    <button *ngIf="!isAuthenticated" (click)="login()">Login com Azure AD</button>
    <button *ngIf="isAuthenticated" (click)="getProtectedData()">Obter Dados Protegidos</button>
    <div *ngIf="data">
      <h3>Dados Protegidos:</h3>
      <pre>{{ data | json }}</pre>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  data: any;

  constructor(private msalService: MsalService, private apiService: ApiService) {}

  ngOnInit() {
    this.msalService.instance.handleRedirectPromise().then((response) => {
      if (response && response.account) {
        this.msalService.instance.setActiveAccount(response.account);
        this.isAuthenticated = true;
      } else if (this.msalService.instance.getAllAccounts().length > 0) {
        this.isAuthenticated = true;
      }
    }).catch((error) => {
      console.error('Erro ao processar handleRedirectPromise:', error);
    });
  }

  login() {
    this.msalService.loginPopup().subscribe({
      next: (response) => {
        this.isAuthenticated = true;
        console.log('Login realizado com sucesso!', response);
        this.msalService.instance.setActiveAccount(response.account); // Define a conta ativa
      },
      error: (error) => {
        console.error('Erro no login:', error);
      },
    });
  }

  getProtectedData() {
    this.msalService
      .acquireTokenSilent({
        scopes: ['api://YOUR_API_CLIENT_ID/access_as_user'], // Substitua pelos escopos configurados no Azure AD
      })
      .subscribe({
        next: (response) => {
          const accessToken = response.accessToken;
          console.log('Token obtido:', accessToken);

          this.apiService.getProtectedData(accessToken).subscribe({
            next: (data) => {
              this.data = data;
              console.log('Dados protegidos recebidos:', data);
            },
            error: (error) => {
              console.error('Erro ao acessar dados protegidos:', error);
            },
          });
        },
        error: (error) => {
          console.error('Erro ao obter token:', error);
        },
      });
  }
}
