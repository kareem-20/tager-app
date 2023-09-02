import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
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
    private route: ActivatedRoute,
    private cartService: CartService,
    private dataService: DataService
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    this.cat = this.dataService.params.cat;
    this.id = await this.route.snapshot.params['id'];
    this.getProduct();
  }
  getProduct(ev?: any) {
    this.dataService.getData(this.endPoint).subscribe(
      (res: any) => {
        console.log(res);
        this.items =
          this.skip > 1 ? this.items.concat(res.data.items) : res.data.items;
        this.checkItemsCart(this.items);
        this.checkItemsFav(this.items);
        if (this.items.length) this.showContent(ev);
        else this.showEmptyView(ev);
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }
  get endPoint(): string {
    let url: string = `/api/item/get-paginate?page=${this.skip}`;
    if (this.id) url += `&cat_id=${this.id}`;
    if (this.search_txt.trim().length)
      url += `&search_txt=${this.search_txt.trim()}`;
    return url;
  }

  details(prod: any) {
    this.dataService.setParams({ ...this.dataService.params, prod });
    this.navCtrl.navigateForward('/tabs/product-details');
  }

  addItem(product: any) {
    this.cartService.addItem(product);
    product.addedToCart = true;
  }
  checkItemsCart(items: any[]) {
    for (let item of items) {
      this.cartService.getItemCart(item);
    }
  }
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
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

  doRefresh(ev: any) {
    this.skip = 1;
    this.getProduct(ev);
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
