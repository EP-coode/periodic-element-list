import { Routes } from '@angular/router';

export const periodicTableRoutes: Routes = [
  {
    path: '',
    title: 'Periodic table',
    loadComponent: () => import('./views/periodic-table/periodic-table.view'),
  },
];
