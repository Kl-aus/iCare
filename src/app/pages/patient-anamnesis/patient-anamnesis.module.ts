import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientAnamnesisPageRoutingModule } from './patient-anamnesis-routing.module';

import { PatientAnamnesisPage } from './patient-anamnesis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientAnamnesisPageRoutingModule
  ],
  declarations: [PatientAnamnesisPage]
})
export class PatientAnamnesisPageModule {}
