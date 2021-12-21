import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModeratorPage } from './moderator.page';

const routes: Routes = [
  {
    path: '',
    component: ModeratorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModeratorPageRoutingModule {}
