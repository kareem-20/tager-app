import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  bills: any[] = [];
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  skip: any = 0;
  userData: any;
  orderStatus: number = 0;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    // private storage: Storage,
    private dataService: DataService
  ) {}
  orders: any[] = [1, 2, 3, 4];
  ngOnInit() {
    this.userData = this.authService.userData;
    this.getBills();
  }

  getBills(ev?: any) {
    this.dataService.getData(this.endPoint).subscribe(
      (res: any) => {
        console.log(res);
        // this.count = res.count;

        this.bills = this.skip ? this.bills.concat(res.data) : res.data;
        this.bills.length ? this.showContentView(ev) : this.showEmptyView(ev);
        this.bills.forEach((item: any) => (item.INFO = JSON.parse(item.INFO)));
        this.bills.forEach(
          (item: any) => (item.DETAILS = JSON.parse(item.DETAILS))
        );

        console.log(this.bills);

        // this.disableInfinity = res?.length != 20
        // if (ev) ev.target.complete()
      },
      (err) => {
        this.showErrorView(err);
      }
    );
  }
  get endPoint() {
    //
    console.log(this.userData);

    let url;
    if (this.orderStatus == 0)
      url = `/api/invoice/get/?MANDOOB_CODE=${this.userData.MANDOOB_CODE}`;
    else
      url = `/api/t_sales/get/?MANDOOB_CODE=${this.userData.MANDOOB_CODE}&SHIP_CODE=${this.orderStatus}`;

    // if (this.skip) url += `&skip=${this.skip}`;
    // url += `&is_accept=${this.orderStatus}`;

    if (this.skip) url += `&skip=${this.skip}`;
    return url;
  }
  showContentView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = false;
    // this.disableInfinity = false;
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
  back() {
    this.navCtrl.back();
  }

  change(ev) {
    this.orderStatus = ev.detail.value;
    this.getBills();
  }
  details(bill) {
    console.log(bill);

    this.dataService.setParams({ bill: bill });
    this.navCtrl.navigateForward(`order-details/${bill?.BILL_NUMBER}`);
  }

  doRefresh(ev: any) {
    this.loading = true;
    this.skip = 0;
    this.getBills(ev);
    // this.getAllProduct(ev);
  }
}
