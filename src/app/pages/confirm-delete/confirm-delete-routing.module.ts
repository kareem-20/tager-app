import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmDeletePage } from './confirm-delete.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmDeletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmDeletePageRoutingModule {}
