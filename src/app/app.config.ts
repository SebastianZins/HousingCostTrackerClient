import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

const RobotoAura = definePreset(Aura, {
  semantic: {
    typography: {
      fontFamily: "'Roboto', sans-serif",
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // PrimeNG
    providePrimeNG({
      overlayAppendTo: 'body',
      ripple: true,
      theme: {
        preset: RobotoAura,
      },
      license:
        'eyJpZCI6IjI1NjUwMDYyLTc3MGQtNGU4ZS1iYTAyLTc2NTVmOGVkMDhhZiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTIyMzM3MzcsImV4cCI6MTgyMzc2OTczN30.CJ-lthSG-ymQzhkKwLw4OuHH2sREUog0ruUScanM5L4eyOAwxXM6Zfw7s3lF1jk0ro-xl-CAMXnMzK3m1NmWDw',
    }),

    // Singletons
    MessageService,
  ],
};
