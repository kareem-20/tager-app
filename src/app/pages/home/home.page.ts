import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import SwiperCore, { Autoplay, Keyboard, Pagination } from 'swiper';
import { IonicSlides, NavController } from '@ionic/angular';
import { Subscription, forkJoin } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { Events } from 'src/app/enums/events';
SwiperCore.use([Autoplay, Pagination, Keyboard, IonicSlides]);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  slides: any[] = [];
  categories: any[] = [];
  products: any[] = [];
  loading = true;
  emptyView = false;
  errorView = false;
  cartCount: number = 0;
  search_txt: string = '';
  skip: number = 1;
  activeCat: any;
  eventSubscription: Subscription;
  searchList: any = [];
  searchQuery: any;
  // swiper
  interval: any;
  @ViewChild('swiper') swiperRef: any | undefined;
  swiper?: Swiper;
  add: any;
  /// category Products
  categoryProducts: any[] = [];
  skipCategoryProducts = 1;
  categoryProductLoading: boolean = true;
  categoryProductEmpty: boolean = false;
  maxPageCategory: number;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private cartService: CartService,
    private functionsService: FunctionsService
  ) {}

  async ngOnInit() {
    this.watchCart();
    this.getAllData();
    this.getItems();

    // this.getAllProduct();
    this.eventSubscription = this.functionsService
      .onChangeEvent()
      .subscribe((eventName) => {
        console.log(eventName);
        if (eventName == Events.refreshHome) {
          this.getAllData();
        }
      });
    this.autoplay();
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  autoplay(): void {
    this.interval = setInterval(() => {
      const element = this.swiperRef.nativeElement.swiper;
      const index = element.activeIndex;
      index == this.slides.length - 1
        ? element.slideTo(0, 600)
        : element.slideTo(index + 1, 600);
    }, 5000);
  }
  getAllData(ev?: any) {
    forkJoin([
      this.dataService.getData(
        `/api/item/get-images/?item_code=-1&type_image=-1`
      ),
      this.dataService.getData('/api/category/get'),
      this.dataService.getData(this.endPoint),
      this.dataService.getMongoData('/add'),
    ]).subscribe(
      (res: any) => {
        console.log(res);

        this.slides = res[0].data;
        this.categories = res[1].data;
        this.products = res[2].data.items;
        this.activeCat = this.categories[0].CATEGORY_CODE;
        // this.categoryProducts = res[2].data.items;
        this.add = res[3].text;
        this.getCategoryProducts();
        this.checkItemsCart(this.categoryProducts);
        this.checkItemsCart(this.products);
        this.checkItemsFav([...this.categoryProducts, ...this.products]);
        const element = this.swiperRef.nativeElement.swiper;
        element.slideTo(0, 600);

        this.showContent(ev);
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }

  getCategoryProducts(ev?: any) {
    this.dataService.getData(this.endPointCategory).subscribe((res: any) => {
      this.maxPageCategory = res.data.pagination.max_page;
      this.categoryProducts =
        this.skipCategoryProducts > 1
          ? this.categoryProducts.concat(res.data.items)
          : res.data.items;
      if (this.categoryProducts.length)
        (this.categoryProductLoading = false),
          (this.categoryProductEmpty = false);
      else
        (this.categoryProductEmpty = true),
          (this.categoryProductLoading = false);
      console.log(this.categoryProducts);

      if (ev) ev.target.complete();
    });
  }
  get endPointCategory(): string {
    let url = `/api/item/get-paginate?cat_id=${this.activeCat}&page=${this.skipCategoryProducts}`;
    return url;
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
  checkItemsFav(items: any[]) {
    for (let item of items) {
      this.cartService.getItemFavourit(item);
    }
  }
  toggleFav(item: any) {
    item.favorite = !item?.favorite;
    this.cartService.toggleFav(item);
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
  getItems() {
    this.dataService.getData(this.endPoint).subscribe((res: any) => {
      this.products = res.data.items;
    });
  }
  async ionViewWillEnter() {
    await this.cartService.reloadCart();
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

  get endPoint(): string {
    let url = '/api/item/get-paginate?page=1&is_feat=true';
    if (this.search_txt.trim().length)
      url += `&search_txt=${this.search_txt.trim()}`;
    return url;
  }

  watchCart(): void {
    this.cartService.count.subscribe((count) => {
      this.cartCount = count;
    });
  }
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }

  doRefresh(ev: any) {
    this.loading = true;
    this.skip = 1;
    this.skipCategoryProducts = 1;

    this.getAllData(ev);
    this.getItems();
    // this.getAllProduct(ev);
  }
  details(prod: any) {
    this.dataService.setParams({ prod });
    this.navCtrl.navigateForward('/product-details');
  }

  trackFn(item) {
    return item?.ITEM_CODE;
  }

  // search
  search(ev?: any) {
    console.log(ev, this.searchQuery);
    // console.log();

    if (
      this.searchQuery &&
      this.searchQuery !== '' &&
      this.searchQuery.length > 0
    ) {
      this.dataService
        .getData(
          '/api/item/search-by-name?item_name=' + this.searchQuery + `&page=1`
        )
        .subscribe((respons: any) => {
          console.log(respons);
          this.searchList = respons.data;
        });
    } else {
      this.searchList = [];
    }
    if (!ev.length) this.searchList = [];
  }

  changeCategory(cat: any) {
    this.activeCat = cat.CATEGORY_CODE;
    this.categoryProducts = [];
    this.categoryProductEmpty = false;
    this.categoryProductLoading = true;
    this.getCategoryProducts();
    console.log(this.categoryProducts);
  }

  async loadCategoryData() {
    this.categoryProductLoading = true;
    this.skipCategoryProducts += 1;
    this.getCategoryProducts();
    console.log(this.categoryProducts);
  }
  loadData(ev) {
    console.log(ev);
  }
}
