import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'offers',
        loadChildren: () =>
          import('../offers/offers.module').then((m) => m.OffersPageModule),
      },
      {
        path: 'fav',
        loadChildren: () =>
          import('../fav/fav.module').then((m) => m.FavPageModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../account/account.module').then((m) => m.AccountPageModule),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('../category/category.module').then(
            (m) => m.CategoryPageModule
          ),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('../cart/cart-routing.module').then(
            (m) => m.CartPageRoutingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
