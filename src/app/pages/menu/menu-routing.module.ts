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
        path: 'care',
        children: [
          {
            path: '',
            redirectTo: '/menu/care/patients',
            pathMatch: 'full'
          },
          {
            path: 'patients',
            loadChildren: () => import('../../pages/patients/patients.module').then(m => m.PatientsPageModule)
          },
          {
            path: 'patient-dashboard',
            loadChildren: () => import('../../pages/patient-dashboard/patient-dashboard.module').then(m => m.PatientDashboardPageModule)
          },
          {
            path: 'patient-anamnesis',
            loadChildren: () => import('../../pages/patient-anamnesis/patient-anamnesis.module').then(m => m.PatientAnamnesisPageModule)
          },
          {
            path: 'patient-details',
            loadChildren: () => import('../../pages/patient-details/patient-details.module').then( m => m.PatientDetailsPageModule),
          },
          {
            path: 'recommendations',
            loadChildren: () => import('../../pages/recommendations/recommendations.module').then( m => m.RecommendationsPageModule),
          },
          {
            path: 'diagnoses',
            loadChildren: () => import('../../pages/diagnoses/diagnoses.module').then( m => m.DiagnosesPageModule)
          },
          {
            path: 'choose-diagnose',
            loadChildren: () => import('../../pages/choose-diagnose/choose-diagnose.module').then( m => m.ChooseDiagnosePageModule),
          },
        ]
      },
      {
        path: '',
        redirectTo: '/menu/care/patients',
        pathMatch: 'full'
      },
      {
        path: 'moderator',
        loadChildren: () => import('../moderator/moderator.module').then( m => m.ModeratorPageModule),
        canActivate: [RoleGuard]
      },
      {
        path: 'maps',
        loadChildren: () => import('../maps/maps.module').then( m => m.MapsPageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'ranking',
        loadChildren: () => import('../ranking/ranking.module').then( m => m.RankingPageModule),
        canActivate: [RoleGuard]
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
