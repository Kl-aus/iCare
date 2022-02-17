import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PatientAnamnesisPageRoutingModule } from './patient-anamnesis-routing.module';
import { PatientAnamnesisPage } from './patient-anamnesis.page';
import {MatExpansionModule} from '@angular/material/expansion';
import {PipeModule} from '../../pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientAnamnesisPageRoutingModule,
    MatExpansionModule,
    PipeModule,
  ],
  declarations: [PatientAnamnesisPage]
})
export class PatientAnamnesisPageModule {}
