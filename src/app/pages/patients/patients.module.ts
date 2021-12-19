import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Ng2SearchPipeModule} from 'ng2-search-filter';

import { PatientsPageRoutingModule } from './patients-routing.module';

import { PatientsPage } from './patients.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    PatientsPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [PatientsPage]
})
export class PatientsPageModule {}
