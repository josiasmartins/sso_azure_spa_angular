import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="!isLoggedIn">
      <button (click)="login()">Login</button>
    </div>
    <div *ngIf="isLoggedIn">
      <h1>Bem-vindo, {{ userName }}</h1>
      <button (click)="logout()">Logout</button>
    </div>
  `,
  standalone: false
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userName: string | null = null;

  constructor(private authService: MsalService) {}

  async ngOnInit() {
    try {
      // Inicializa explicitamente o MSAL se necessário
      const msalInstance = this.authService.instance as PublicClientApplication;

      if (!msalInstance.getActiveAccount()) {
        await msalInstance.initialize(); // Inicializa o MSAL (chave para evitar o erro)
      }

      // Trata redirecionamentos do login
      await this.authService.instance.handleRedirectPromise();

      const account = this.authService.instance.getActiveAccount();
      this.isLoggedIn = !!account;
      this.userName = account?.username || null;
    } catch (error) {
      console.error('Erro ao inicializar o MSAL:', error);
    }
  }

  login() {
    this.authService.loginRedirect();
  }

  logout() {
    this.authService.logoutRedirect();
  }
}
