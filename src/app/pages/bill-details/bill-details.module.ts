import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillDetailsPageRoutingModule } from './bill-details-routing.module';

import { BillDetailsPage } from './bill-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillDetailsPageRoutingModule
  ],
  declarations: [BillDetailsPage]
})
export class BillDetailsPageModule {}
