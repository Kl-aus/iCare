import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PatientDetaisPageRoutingModule } from './patient-details-routing.module';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { PatientDetailsPage } from './patient-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientDetaisPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PatientDetailsPage]
})
export class PatientDetaisPageModule {}
