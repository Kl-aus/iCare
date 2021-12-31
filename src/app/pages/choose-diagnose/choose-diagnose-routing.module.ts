import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseDiagnosePage } from './choose-diagnose.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseDiagnosePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseDiagnosePageRoutingModule {}
