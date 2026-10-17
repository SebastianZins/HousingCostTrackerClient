import { LandingPage } from './pages/landing-page/landing-page';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    component: LandingPage,
  },
];
