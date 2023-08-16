import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoneOrderPage } from './done-order.page';

const routes: Routes = [
  {
    path: '',
    component: DoneOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoneOrderPageRoutingModule {}
