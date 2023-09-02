import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  products: any[] = [];
  photos: any[] = [];
  slideOpts = {
    slidesPerView: 1,
    autoplay: true,
  };
  product: any;
  QTY: number = 1;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private cartService: CartService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.product = this.dataService.params.prod;
    this.QTY = this.product.QTY || 1;
    this.getImages(this.product.ITEM_CODE);
    this.getSimilar(this.product.CATEGORY_CODE);
    console.log(this.product);
  }
  getImages(itemCode: number) {
    this.dataService
      .getData(`/api/item/get-images/?item_code=${itemCode}`)
      .subscribe((res: any) => {
        console.log(res);
        this.photos = res.data;
      });
  }
  increse() {
    this.QTY++;
  }
  decrese() {
    if (this.QTY > 1) this.QTY--;
  }
  getSimilar(itemCode: number) {
    this.dataService
      .getData(`/api/item/get-paginate/?cat_id=${itemCode}&page=1`)
      .subscribe((res: any) => {
        console.log(res);
        this.products = res.data.items;
        this.products.filter((item) => {
          item.ITEM_CODE != this.product.ITEM_CODE;
        });
        this.checkItemsFav(this.products);
        this.checkItemsCart(this.products);
      });
  }
  checkItemsCart(items: any[]) {
    for (let item of items) {
      this.cartService.getItemCart(item);
    }
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
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }

  details(prod: any) {
    console.log(prod);
    this.dataService.setParams({ prod });
    this.navCtrl.navigateForward('product-details');
  }

  addItem(product: any) {
    product.QTY = this.QTY;
    this.cartService.addItem(product);
    product.addedToCart = true;
  }

  updateQty(product: any) {
    product.QTY = this.QTY;
    this.cartService.updateCart(product);
  }
  back() {
    this.navCtrl.back();
  }
}
