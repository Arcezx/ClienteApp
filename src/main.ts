// main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { addIcons } from 'ionicons';
import {
  logoGoogle,
  logoFacebook,
  homeOutline,
  airplaneOutline,
  searchOutline,
  personOutline
} from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

addIcons({
  'logo-google': logoGoogle,
  'logo-facebook': logoFacebook,
  'home-outline': homeOutline,
  'airplane-outline': airplaneOutline,
  'search-outline': searchOutline,
  'person-outline': personOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot())
  ],
});
