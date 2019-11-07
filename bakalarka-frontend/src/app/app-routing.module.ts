import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(mod => mod.DashboardModule),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'import',
    loadChildren: () => import('./pages/import/import.module').then(mod => mod.ImportModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admissions',
    loadChildren: () => import('./pages/admissions/admissions.module').then(mod => mod.AdmissionsModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'students',
    loadChildren: () => import('./pages/students/students.module').then(mod => mod.StudentsModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(mod => mod.LoginModule),
  },
  {
    path: 'accounts',
    loadChildren: () => import('./pages/accounts/accounts.module').then(mod => mod.AccountsModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'statefinalexams',
    loadChildren: () => import('./pages/state-final-exams/state-final-exams.module').then(mod => mod.StateFinalExamsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'statistics',
    loadChildren: () => import('./pages/statistics/statistics.module').then(mod => mod.StatisticsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(mod => mod.DashboardModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
