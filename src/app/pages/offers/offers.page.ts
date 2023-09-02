import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  items: any[] = [];
  id: string;
  cat: any;
  loading = true;
  emptyView = false;
  errorView = false;
  skip: number = 1;
  search_txt: string = '';

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private cartService: CartService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getData();
  }

  getData(ev?: any) {
    this.dataService.getData('/api/item/get-discount').subscribe(
      (res: any) => {
        console.log(res);

        this.items = res.data;

        if (this.items.length)
          this.checkItemsCart(this.items), this.checkItemsFav(this.items);
        if (this.items.length) this.showContent(ev);
        else this.showEmptyView(ev);
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }
  checkItemsCart(items: any[]) {
    for (let item of items) {
      this.cartService.getItemCart(item);
    }
  }
  addItem(product: any) {
    this.cartService.addItem(product);
    product.addedToCart = true;
  }
  details(prod: any) {
    this.dataService.setParams({ ...this.dataService.params, prod });
    this.navCtrl.navigateForward('/tabs/pages/product-details');
  }
  showContent(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = false;
    if (ev) ev.target.complete();
  }

  showErrorView(ev?: any) {
    this.loading = false;
    this.errorView = true;
    this.emptyView = false;
    if (ev) ev.target.complete();
  }

  showEmptyView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = true;
    if (ev) ev.target.complete();
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
  back() {
    this.navCtrl.back();
  }
  checkItemsFav(items: any[]) {
    for (let item of items) {
      this.cartService.getItemFavourit(item);
    }
  }
  toggleFav(item: any) {
    item.favorite = !item?.favorite;
    this.cartService.toggleFav(item);
  }
}
