import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountListPageRoutingModule } from './count-list-routing.module';

import { CountListPage } from './count-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountListPageRoutingModule
  ],
  declarations: [CountListPage]
})
export class CountListPageModule {}
