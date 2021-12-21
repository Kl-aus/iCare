import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModeratorPageRoutingModule } from './moderator-routing.module';

import { ModeratorPage } from './moderator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModeratorPageRoutingModule
  ],
  declarations: [ModeratorPage]
})
export class ModeratorPageModule {}
