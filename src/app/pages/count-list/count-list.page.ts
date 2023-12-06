import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonPopover, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-count-list',
  templateUrl: './count-list.page.html',
  styleUrls: ['./count-list.page.scss'],
})
export class CountListPage implements OnInit {
  @ViewChild('optionsPopover') optionsPopover: IonPopover;
  selectedBill: any;
  optionsOpen = false;
  bills: any[] = [];
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  skip: any = 0;
  userData: any;
  SHIP_CODE: any;
  IVC_CODE: any;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private helpers: FunctionsService,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    // let id = await this.route.snapshot.params['id'];
    // if (id == 3) {
    //   this.SHIP_CODE = null;
    //   this.IVC_CODE == 10;
    // } else this.SHIP_CODE = id;
  }
  async ionViewWillEnter() {
    this.SHIP_CODE = (await this.dataService.params?.SHIP_CODE) || null;
    this.IVC_CODE = (await this.dataService.params?.IVC_CODE) || null;
    console.log(this.dataService.params);

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
        // this.bills.forEach((item: any) => (item.INFO = JSON.parse(item.INFO)));
        // this.bills.forEach(
        //   (item: any) => (item.DETAILS = JSON.parse(item.DETAILS))
        // );

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
    let url = `/api/sales/get`;
    url += `?MANDOOB_CODE=${this.authService.userData.MANDOOB_CODE}`;
    if (this.SHIP_CODE) url += `&SHIP_CODE=${this.SHIP_CODE}`;

    if (this.IVC_CODE) url += `&IVC_CODE=${this.IVC_CODE}`;

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

  back() {
    this.navCtrl.back();
  }
  openDetails(bill: any) {
    this.dataService.setParams({ bill });
    this.navCtrl.navigateForward(`/bill-details`);
  }

  details(bill: any) {
    this.dataService.setParams({ bill: bill });
    this.navCtrl.navigateForward(`count-details/${bill?.BILL_NUMBER}`);
  }
  doRefresh(ev: any) {
    this.getBills(ev);
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
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
