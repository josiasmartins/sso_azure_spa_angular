import { bootstrapApplication, platformBrowser } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';

platformBrowser().bootstrapModule(AppModule);
