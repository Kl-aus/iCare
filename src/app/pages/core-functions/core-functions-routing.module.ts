import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoreFunctionsPage } from './core-functions.page';


const routes: Routes = [
  {
    path: 'core-functions',
    component: CoreFunctionsPage,
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
      }
    ]
  },
  {
    path: '',
    redirectTo: 'core-functions/patients',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreFunctionsPageRoutingModule {}
