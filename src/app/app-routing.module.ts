import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'products/:id',
    loadChildren: () =>
      import('./pages/products/products.module').then(
        (m) => m.ProductsPageModule
      ),
  },
  {
    path: 'product-details',
    loadChildren: () =>
      import('./pages/product-details/product-details.module').then(
        (m) => m.ProductDetailsPageModule
      ),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./pages/cart/cart.module').then((m) => m.CartPageModule),
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./pages/category/category.module').then(
        (m) => m.CategoryPageModule
      ),
  },
  {
    path: 'confirm-delete',
    loadChildren: () =>
      import('./pages/confirm-delete/confirm-delete.module').then(
        (m) => m.ConfirmDeletePageModule
      ),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'balance-account',
    loadChildren: () =>
      import('./pages/balance-account/balance-account.module').then(
        (m) => m.BalanceAccountPageModule
      ),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./pages/orders/orders.module').then((m) => m.OrdersPageModule),
  },
  {
    path: 'confirm',
    loadChildren: () =>
      import('./pages/confirm/confirm.module').then((m) => m.ConfirmPageModule),
  },
  {
    path: 'done-order',
    loadChildren: () =>
      import('./pages/done-order/done-order.module').then(
        (m) => m.DoneOrderPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./pages/clients/clients.module').then((m) => m.ClientsPageModule),
  },
  {
    path: 'add-client',
    loadChildren: () =>
      import('./pages/add-client/add-client.module').then(
        (m) => m.AddClientPageModule
      ),
  },
  {
    path: 'send-order',
    loadChildren: () =>
      import('./pages/send-order/send-order.module').then(
        (m) => m.SendOrderPageModule
      ),
  },
  {
    path: 'order-details/:id',
    loadChildren: () =>
      import('./pages/order-details/order-details.module').then(
        (m) => m.OrderDetailsPageModule
      ),
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
