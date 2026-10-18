import { LandingPage } from './pages/landing-page/landing-page';
import { OverviewPage } from './pages/overview/overview';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'overview',
    pathMatch: 'full',
    component: OverviewPage,
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: LandingPage,
  },
  {
    path: 'landing',
    component: LandingPage,
  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
];
