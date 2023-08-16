import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceAccountPageRoutingModule } from './balance-account-routing.module';

import { BalanceAccountPage } from './balance-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceAccountPageRoutingModule
  ],
  declarations: [BalanceAccountPage]
})
export class BalanceAccountPageModule {}
