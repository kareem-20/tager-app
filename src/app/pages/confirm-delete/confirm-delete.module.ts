import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmDeletePageRoutingModule } from './confirm-delete-routing.module';

import { ConfirmDeletePage } from './confirm-delete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmDeletePageRoutingModule
  ],
  declarations: [ConfirmDeletePage]
})
export class ConfirmDeletePageModule {}
