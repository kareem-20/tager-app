import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendOrderPageRoutingModule } from './send-order-routing.module';

import { SendOrderPage } from './send-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendOrderPageRoutingModule
  ],
  declarations: [SendOrderPage]
})
export class SendOrderPageModule {}
