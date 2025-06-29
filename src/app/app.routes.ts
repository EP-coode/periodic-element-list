import { Routes } from '@angular/router';
import { periodicTableRoutes } from './modules/periodic-table/periodic-table.routing';
import { MainLayout } from '@common/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        children: periodicTableRoutes,
      },
    ],
  },
];
