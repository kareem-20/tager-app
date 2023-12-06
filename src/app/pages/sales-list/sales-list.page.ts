import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonPopover, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.page.html',
  styleUrls: ['./sales-list.page.scss'],
})
export class SalesListPage implements OnInit {
  SHIP_CODE: any;
  @ViewChild('optionsPopover') optionsPopover: IonPopover;
  selectedBill: any;
  optionsOpen = false;
  bills: any[] = [];
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  skip: any = 0;
  shippingCodes: any[] = [];
  userData: any;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private dataService: DataService,
    private helpers: FunctionsService
  ) {}

  async ngOnInit() {
    this.userData = await this.storage.get('user');
    console.log(this.userData);

    // this.getShippingCode();
    this.getBills();
  }
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }
  segmentChanged(ev: any) {
    this.skip = 0;
    console.log(ev);

    this.getBills();
  }

  presentOptionsPopover(e: any, bill: any) {
    this.selectedBill = bill;
    this.optionsPopover.event = e;
    this.optionsOpen = true;
  }

  loadData(ev: any) {
    this.skip += 1;
    this.getBills(ev);
  }
  trackFun(item: any): string {
    return item._id;
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

  getShippingCode() {
    this.dataService
      .getData('/api/t_sales/getShipping')
      .subscribe((res: any) => {
        console.log(res);
        this.shippingCodes = res.data;
      });
  }
  get endPoint() {
    let url = `/api/invoice/get/?userId=${this.userData.ACCOUNT_CODE}&MANDOOB_CODE=${this.userData.MANDOOB_CODE}`;
    // if (this.skip) url += `&skip=${this.skip}`;

    if (this.skip) url += `&skip=${this.skip}`;
    // if (this.SHIP_CODE) url += `&SHIP_CODE=${this.SHIP_CODE}`;
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

  details() {
    this.dataService.setParams({ bill: this.selectedBill });
    this.navCtrl.navigateForward(
      `bill-details/${this.selectedBill?.BILL_NUMBER}`
    );
  }

  back() {
    this.navCtrl.navigateBack('/tabs/account');
  }
  async delete(bill: any) {
    const alert = await this.alertCtrl.create({
      header: 'تأكيد الحذف',
      message: 'هل تريد الغاء الطلب ؟',
      mode: 'ios',
      buttons: [
        {
          text: 'الغاء',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'حذف',
          handler: () => {
            this.dataService
              .deleteData(`/api/invoice/delete/${bill.T_ID}`)
              .subscribe(
                (res) => {
                  this.helpers.presentToast('تم الحذف بنجاح');
                  console.log(res);
                  this.getBills();
                },
                (err) => {
                  console.log(err);
                }
              );
          },
        },
      ],
    });
    await alert.present();
  }
  openDetails(bill: any) {
    this.dataService.setParams({ bill });
    this.navCtrl.navigateForward(`/bill-details`);
  }
  doRefresh(ev: any) {
    this.getBills(ev);
  }
}
