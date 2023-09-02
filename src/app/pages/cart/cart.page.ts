import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { ConfirmDeletePage } from '../confirm-delete/confirm-delete.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  items: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private cartService: CartService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.items = this.cartService.items;
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

  async clearCart() {
    const alert = await this.alertCtrl.create({
      header: 'هل تريد حذف كل العناصر',
      mode: 'ios',
      buttons: [
        {
          text: 'الغاء',
          role: 'cancel',
        },
        {
          text: 'حذف',
          handler: () => {
            this.cartService.clearCart().then(() => {
              this.items = [];
            });
          },
        },
      ],
    });
    await alert.present();
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
