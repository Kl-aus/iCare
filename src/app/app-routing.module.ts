import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PatientDetailsPage } from './pages/patient-details/patient-details.page';
import {IntroGuard} from './guards/intro.guard';
import {AutoLoginGuard} from './guards/auto-login.guard';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },

  // {
  //   path: 'choose-diagnose',
  //   loadChildren: () => import('./pages/choose-diagnose/choose-diagnose.module').then( m => m.ChooseDiagnosePageModule),
  //   canLoad: [AuthGuard]
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
