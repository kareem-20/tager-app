import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountDetailsPage } from './count-details.page';

const routes: Routes = [
  {
    path: '',
    component: CountDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountDetailsPageRoutingModule {}
