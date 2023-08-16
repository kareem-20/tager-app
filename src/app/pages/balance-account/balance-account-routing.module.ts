import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceAccountPage } from './balance-account.page';

const routes: Routes = [
  {
    path: '',
    component: BalanceAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceAccountPageRoutingModule {}
