import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'patients',
        loadChildren: () => import('../patients/patients.module').then(m => m.PatientsPageModule)
      },
      {
        path: 'diagnoses',
        loadChildren: () => import('../diagnoses/diagnoses.module').then(m => m.DiagnosesPageModule)
      },
      {
        path: 'recommendations',
        loadChildren: () => import('../recommendations/recommendations.module').then(m => m.RecommendationsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../pages/profile/profile.module').then( m => m.ProfilePageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/menu/patients',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
