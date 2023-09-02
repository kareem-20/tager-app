import { CartService } from './../../services/cart/cart.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Events } from 'src/app/enums/events';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  cartCount: number;
  subscription: Subscription;

  constructor(
    private cartService: CartService,
    private functionService: FunctionsService
  ) {}

  ngOnInit() {
    this.watchCart();
  }

  watchCart() {
    this.subscription = this.cartService.count.subscribe(
      (res) => (this.cartCount = res)
    );
    console.log(this.cartCount);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  change(ev) {
    console.log(ev);
    if (ev.tab == 'home') this.functionService.emitEvent(Events.refreshHome);
  }
}
