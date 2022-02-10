import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientAnamnesisPage } from './patient-anamnesis.page';

const routes: Routes = [
  {
    path: '',
    component: PatientAnamnesisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientAnamnesisPageRoutingModule {}
