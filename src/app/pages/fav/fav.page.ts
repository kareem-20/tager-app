import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.page.html',
  styleUrls: ['./fav.page.scss'],
})
export class FavPage implements OnInit {
  offers: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  items: any[] = [];
  id: string;
  cat: any;
  loading = true;
  emptyView = false;
  errorView = false;
  skip: number = 1;
  search_txt: string = '';
  fav: any[] = this.cartService.fav;

  constructor(
    private navCtrl: NavController,
    private helpers: FunctionsService,
    private dataService: DataService,
    private cartService: CartService
  ) {}
  ngOnInit() {}
  ionViewWillEnter() {
    this.fav = this.cartService.fav;
    if (!this.fav.length) (this.emptyView = true), (this.loading = false);
    else (this.emptyView = false), (this.loading = false);
  }
  checkItemsCart(items: any[]) {
    for (let item of items) {
      this.cartService.getItemCart(item);
    }
  }
  back() {
    this.navCtrl.back();
  }

  addItem(product: any) {
    if (product.addedToCart)
      return this.helpers.presentToast('هذا المنتج مضاف بالفعل');
    this.cartService.addItem(product);
    product.addedToCart = true;
  }
  checkItemsFav(items: any[]) {
    for (let item of items) {
      this.cartService.getItemFavourit(item);
    }
  }

  trackBy(index: number, pro: any): number {
    return pro.ITEM_CODE;
  }

  toggleFav(item: any) {
    item.favorite = !item?.favorite;
    this.cartService.toggleFav(item);
    this.fav = this.cartService.fav;
    if (this.fav.length === 0) this.emptyView = true;
  }

  details(prod: any) {
    this.dataService.setParams({ prod });
    this.navCtrl.navigateForward('/product-details');
  }

  increse(item: any) {
    item.QTY++;
    this.cartService.updateCart(item);
  }
  decrese(item: any) {
    if (item.QTY > 1) {
      item.QTY--;
      this.cartService.updateCart(item);
    }
  }
}
