import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountDetailsPageRoutingModule } from './count-details-routing.module';

import { CountDetailsPage } from './count-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountDetailsPageRoutingModule
  ],
  declarations: [CountDetailsPage]
})
export class CountDetailsPageModule {}
