import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    // path: '',
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
    path: 'settings',
    loadChildren: './pages/settings/settings.module#SettingsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admissions',
    loadChildren: './pages/admissions/admissions.module#AdmissionsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'accounts',
    loadChildren: './pages/accounts/accounts.module#AccountsModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
