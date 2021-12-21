import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoreFunctionsPageRoutingModule } from './core-functions-routing.module';

import { CoreFunctionsPage } from './core-functions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoreFunctionsPageRoutingModule
  ],
  declarations: [CoreFunctionsPage]
})
export class CoreFunctionsPageModule {}
