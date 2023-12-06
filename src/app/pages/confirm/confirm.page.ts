import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  test: number;
  disable: boolean = true;
  items: any[] = [];
  clientPrice: number = 0;
  totalPrice: number = 0;
  deliveryCost: number = 0;
  method: number = 0;
  shiping: any[] = [];
  selected: any;
  paidCash: number = 0;

  constructor(
    private navCtrl: NavController,
    private cartService: CartService,
    private dataService: DataService
  ) {}
  ngOnInit() {
    this.getShiping();
  }
  ionViewWillEnter() {
    this.items = this.cartService.items;
    this.items.forEach((item) => {
      if (item.QTY < 0) item.price = item.totalPriceMandob;
    });
    this.totalPrice = this.items.reduce(
      (i, j) => i + j.QTY * j.PRICE_SALE_1,
      0
    );
    this.calcTotal();
    this.checkValid();
  }
  back() {
    this.navCtrl.pop();
  }
  nav(path: string) {
    this.navCtrl.navigateForward(path);
  }

  calcTotal() {
    this.clientPrice = this.items.reduce((i, j) => i + j.QTY * j.price, 0);
  }
  sendAsGift(ev: any, item: any) {
    item.gift = ev.detail.checked;
    item.price = 0;
    this.calcTotal();
  }

  checkValid() {
    this.items.forEach((item) => {
      if (item.gift) item.valid = true;
      else {
        if (
          item.price <= item.PRICE_SALE_3 &&
          item.price >= item.PRICE_SALE_2 &&
          item.price != null
        )
          item.valid = true;
        else item.valid = false;
      }
    });
    this.disable = !this.items.every((item) => {
      return item.valid == true;
    });
  }
  getShiping() {
    this.dataService.getData('/api/shiping/get').subscribe((res: any) => {
      console.log(res);
      this.shiping = res.data;
    });
  }
  confirm() {
    this.cartService.items = this.items;
    this.cartService.totalPrice = this.totalPrice;
    this.cartService.clientPrice = this.clientPrice;
    this.cartService.deliveryCost = this.selected?.REGION_SELL;
    this.cartService.paidCash = this.paidCash;
    this.dataService.setParams({ selectedZone: this.selected });
    this.navCtrl.navigateForward('/clients');
  }
}
