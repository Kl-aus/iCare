import { NgModule } from '@angular/core';
import {Routes, RouterModule, CanActivate} from '@angular/router';

import { MenuPage } from './menu.page';
import {RoleGuard} from '../../guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'core-functions',
        loadChildren: () => import('../core-functions/core-functions.module').then(m => m.CoreFunctionsPageModule)
      },
      {
        path: 'moderator',
        loadChildren: () => import('../../pages/moderator/moderator.module').then( m => m.ModeratorPageModule),
        canActivate: [RoleGuard]
      },
      {
        path: 'maps',
        loadChildren: () => import('../../pages/maps/maps.module').then( m => m.MapsPageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('../../pages/profile/profile.module').then( m => m.ProfilePageModule)
      },

    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
