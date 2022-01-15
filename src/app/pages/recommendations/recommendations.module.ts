import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';

import { RecommendationsPageRoutingModule } from './recommendations-routing.module';

import { RecommendationsPage } from './recommendations.page';
import {Ng2SearchPipeModule} from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    Ng2SearchPipeModule,
    RecommendationsPageRoutingModule
  ],
  declarations: [RecommendationsPage]
})
export class RecommendationsPageModule {}
