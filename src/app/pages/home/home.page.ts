import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
export class HomePage implements OnInit, AfterViewInit {
  slides: any[] = [];
  categories: any[] = [];
  products: any[] = [];
  loading = true;
  emptyView = false;
  errorView = false;
  cartCount: number = 0;
  search_txt: string = '';
  skip: number = 1;
  activeCat: any = null;
  eventSubscription: Subscription;
  searchList: any = [];
  searchQuery: any;
  // swiper
  interval: any;
  @ViewChild('swiper') swiperRef: any | undefined;
  swiper?: Swiper;
  add: any;
  /// category Products
  featProducts: any[] = [];
  skipfeatProducts = 1;
  featProductLoading: boolean = true;
  featProductEmpty: boolean = false;
  maxPagefeat: number;

  /// Intersection Observer vars
  @ViewChildren('theLastItem', { read: ElementRef })
  theLastItem: QueryList<ElementRef>;
  observer: any;
  constructor(
    private navCtrl: NavController,
    public dataService: DataService,
    private cartService: CartService,
    private functionsService: FunctionsService
  ) {}

  async ngOnInit() {
    this.watchCart();
    this.getAllData();
    this.getItems();
    this.intersectionObserver();
    // this.getAllProduct();
    this.eventSubscription = this.functionsService
      .onChangeEvent()
      .subscribe((eventName) => {
        console.log(eventName);
        if (eventName == Events.refreshHome) {
          this.activeCat = null;
          this.getAllData();
        }
      });
    this.autoplay();
  }
  ngAfterViewInit(): void {
    console.log(this.theLastItem);
    this.theLastItem.changes.subscribe((d) => {
      console.log(this.observer);

      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }
  intersectionObserver() {
    let options = {
      root: document.querySelector('#scrollArea'),
      rootMargin: '0px',
      threshold: 0.5,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        this.maxPagefeat > this.skipfeatProducts
      ) {
        console.log('scroll More ...');
        this.loadCategoryData();
      }
    }, options);
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
      this.dataService.getData(`/api/item/get-images/?type_image=-1`),
      this.dataService.getData('/api/category/get'),
      this.dataService.getData(this.endPoint),
      this.dataService.getMongoData('/add'),
    ]).subscribe(
      (res: any) => {
        console.log(res);

        this.slides = res[0].data;
        this.categories = res[1].data;
        this.products = res[2].data.items;
        // this.activeCat = this.categories[0].CATEGORY_CODE;
        // this.categoryProducts = res[2].data.items;
        this.add = res[3].text;
        if (
          this.maxPagefeat > this.skipfeatProducts ||
          this.skipfeatProducts == 1
        )
          this.getCategoryProducts();
        this.checkItemsCart(this.featProducts);
        this.checkItemsCart(this.products);
        this.checkItemsFav([...this.featProducts, ...this.products]);
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
      this.maxPagefeat = res.data.pagination.max_page;
      this.featProducts =
        this.skipfeatProducts > 1
          ? this.featProducts.concat(res.data.items)
          : res.data.items;
      if (this.featProducts.length)
        (this.featProductLoading = false), (this.featProductEmpty = false);
      else (this.featProductEmpty = true), (this.featProductLoading = false);
      console.log(this.featProducts);

      if (ev) ev.target.complete();
    });
  }
  get endPointCategory(): string {
    //'/api/item/get-paginate?page=1&is_feat=true'
    let url = `/api/item/get-paginate?page=${this.skipfeatProducts}&is_feat=true`;
    // if (this.activeCat != null) url += `&cat_id=${this.activeCat}`;
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
  getItems(ev?: any) {
    this.dataService.getData(this.endPoint).subscribe((res: any) => {
      this.products =
        this.skip > 1 ? this.products.concat(res.data.items) : res.data.items;
      if (ev) ev.target.complete();
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
    let url = '/api/item/get-paginate';
    if (this.activeCat != null) url += `&cat_id=${this.activeCat}`;
    if (this.skip) url += `&page=${this.skip}`;
    if (this.search_txt.trim().length)
      url += `&search_txt=${this.search_txt.trim()}`;
    return url.replace('&', '?');
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
    this.skipfeatProducts = 1;

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
    // this.categoryProducts = [];
    // this.categoryProductEmpty = false;
    // this.categoryProductLoading = true;
    // this.getCategoryProducts();
    // console.log(this.categoryProducts);

    this.products = [];
    this.emptyView = false;
    this.getItems();
  }

  async loadCategoryData() {
    this.featProductLoading = true;
    this.skipfeatProducts += 1;
    this.getCategoryProducts();
    // console.log(this.categoryProducts);
  }
  loadData(ev) {
    this.skip += 1;
    this.getItems(ev);
    console.log(ev);
  }
}
