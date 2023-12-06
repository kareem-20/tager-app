import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountListPage } from './count-list.page';

const routes: Routes = [
  {
    path: '',
    component: CountListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountListPageRoutingModule {}
