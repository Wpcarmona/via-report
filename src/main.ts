import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth, initializeAuth, browserLocalPersistence } from '@angular/fire/auth';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
import { firebaseConfig } from './environments/environment';
import { AuthRepository } from './app/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from './app/infrastructure/repositories/auth.repository.impl';
import { ReportRepository } from './app/domain/repositories/report.repository';
import { ReportRepositoryImpl } from './app/infrastructure/repositories/report.repository.impl';
import { provideHttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: ReportRepository, useClass: ReportRepositoryImpl },
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => {
    if (Capacitor.isNativePlatform()) {
      return initializeAuth(getApp(), {
        persistence: browserLocalPersistence,
      });
    }
    return getAuth();
  }),
    provideFirestore(() => getFirestore())
  ],
});
