import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { ConfirmDeletePage } from '../confirm-delete/confirm-delete.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  items: any[] = [2, 1, 4];

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private cartService: CartService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    // this.items = this.cartService.items;
    console.log(this.items);
  }

  async deleteItem(item: any, i: number) {
    const modal = await this.modalCtrl.create({
      component: ConfirmDeletePage,
      componentProps: { item },
      breakpoints: [0, 0.35, 0.55],
      cssClass: 'modal-one',
      initialBreakpoint: 0.35,
      mode: 'md',
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    console.log(result.data);
    if (!result.data) return;
    this.items[i].QTY = 0;
    this.cartService.updateCart(this.items[i]);
    this.items.splice(i, 1);
  }

  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }

  clearCart() {
    this.cartService.clearCart().then(() => {
      this.items = [];
    });
  }
  increseCount(index: number) {
    this.items[index].QTY++;
    this.cartService.updateCart(this.items[index]);
  }
  decreseCount(index: number) {
    if (this.items[index].QTY > 1) this.items[index].QTY--;
    this.cartService.updateCart(this.items[index]);
  }
}
