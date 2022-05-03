import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModeratorPageRoutingModule } from './moderator-routing.module';

import { ModeratorPage } from './moderator.page';
import {MatExpansionModule} from "@angular/material/expansion";
import {Ng2SearchPipeModule} from "ng2-search-filter";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModeratorPageRoutingModule,
    MatExpansionModule,
    Ng2SearchPipeModule
  ],
  declarations: [ModeratorPage]
})
export class ModeratorPageModule {}
