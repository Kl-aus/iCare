import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientsPage } from './patients.page';

const routes: Routes = [
  {
      path: '',
      component: PatientsPage
  }
  // {
  //   path: '',
  //   redirectTo: 'patients',
  //   pathMatch:'full'
  // },
  // {
  //   path: '',
  //   component: PatientsPage,
  //   children:[
  //     {
  //       path: 'patient-details',
  //       loadChildren: () => import('../patient-details/patient-details.module').then(m => m.PatientDetaisPageModule)
  //     }
  //   ]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsPageRoutingModule {}
