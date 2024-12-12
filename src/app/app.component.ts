// app.component.ts
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { environment } from '../environment/enviroment';
// import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  isUserLoggedIn = false;
  private readonly _destroy = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  async ngOnInit() {
    await this.authService.instance.initialize();
    // Subscribe to MSAL's interaction status updates
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroy)
      )
      .subscribe(() => {
        this.isUserLoggedIn = this.authService.instance.getAllAccounts().length > 0;
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  login(): void {
    const loginRequest = this.msalGuardConfig.authRequest || {};
    this.authService.loginRedirect({ ...loginRequest } as RedirectRequest);
  }

  logout(): void {
    this.authService.logoutRedirect({ postLogoutRedirectUri: environment.postLogoUrl });
  }
}