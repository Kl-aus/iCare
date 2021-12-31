import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChooseDiagnosePageRoutingModule } from './choose-diagnose-routing.module';
import { ChooseDiagnosePage } from './choose-diagnose.page';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { Ng2SearchPipeModule} from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseDiagnosePageRoutingModule,
    ScrollingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ChooseDiagnosePage]
})
export class ChooseDiagnosePageModule {}
