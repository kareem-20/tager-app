import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoneOrderPageRoutingModule } from './done-order-routing.module';

import { DoneOrderPage } from './done-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoneOrderPageRoutingModule
  ],
  declarations: [DoneOrderPage]
})
export class DoneOrderPageModule {}
