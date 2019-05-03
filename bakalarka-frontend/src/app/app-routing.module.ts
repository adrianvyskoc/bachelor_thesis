import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'import',
    loadChildren: './pages/import/import.module#ImportModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admissions',
    loadChildren: './pages/admissions/admissions.module#AdmissionsModule',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'accounts',
    loadChildren: './pages/accounts/accounts.module#AccountsModule',
    canActivate: [AdminGuard]
  },
  {
    path: 'statefinalexams',
    loadChildren: './pages/state-final-exams/state-final-exams.module#StateFinalExamsModule',
    canActivate: [AuthGuard]
  },
  // {
    // todo
  //   path: 'statistics',
  //   loadChildren: './pages/state-final-exams/state-final-exams.module#StateFinalExamsModule',
  //   canActivate: [AuthGuard]
  // },
  {
    path: '**',
    loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
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
