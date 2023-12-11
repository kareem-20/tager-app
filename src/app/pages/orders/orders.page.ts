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
  orderStatus: number = 1;
  SHIP_CODE: any = 1;
  IVC_CODE: any = null;
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
        this.bills = this.skip ? this.bills.concat(res.data) : res.data;
        this.bills.length ? this.showContentView(ev) : this.showEmptyView(ev);
      },
      (err) => {
        this.showErrorView(err);
      }
    );
  }
  get endPoint() {
    //
    let url = `/api/sales/get`;
    url += `?MANDOOB_CODE=${this.authService.userData.MANDOOB_CODE}`;
    if (this.SHIP_CODE) url += `&SHIP_CODE=${this.SHIP_CODE}`;
    if (this.IVC_CODE) url += `&IVC_CODE=${this.IVC_CODE}`;
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
    if (this.orderStatus == 1) {
      this.SHIP_CODE = 1;
      this.IVC_CODE = null;
    } else if (this.orderStatus == 2) {
      this.SHIP_CODE = 2;
      this.IVC_CODE = null;
    } else if (this.orderStatus == 3) {
      this.SHIP_CODE = null;
      this.IVC_CODE = 10;
    }
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
