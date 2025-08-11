import { Routes } from '@angular/router';
import { Routes as NgRoutes } from '@angular/router';
import { provideRoutes } from '@angular/router';
import { ReportsComponent } from './pages/reports/reports.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'reports' },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: 'reports' },
];
