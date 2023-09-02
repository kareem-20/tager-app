import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendOrderPage } from './send-order.page';

const routes: Routes = [
  {
    path: '',
    component: SendOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendOrderPageRoutingModule {}
