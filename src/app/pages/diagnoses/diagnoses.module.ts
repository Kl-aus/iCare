import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DiagnosesPageRoutingModule } from './diagnoses-routing.module';
import { DiagnosesPage } from './diagnoses.page';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {SwiperModule} from "swiper/angular";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagnosesPageRoutingModule,
    ScrollingModule,
    Ng2SearchPipeModule,
    SwiperModule
  ],
  declarations: [DiagnosesPage]
})
export class DiagnosesPageModule {}
