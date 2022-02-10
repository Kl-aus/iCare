import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientsPage } from './patients.page';
import {RoleGuard} from '../../guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: PatientsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsPageRoutingModule {}
