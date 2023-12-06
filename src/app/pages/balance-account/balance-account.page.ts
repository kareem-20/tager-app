import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonPopover, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-balance-account',
  templateUrl: './balance-account.page.html',
  styleUrls: ['./balance-account.page.scss'],
})
export class BalanceAccountPage implements OnInit {
  @ViewChild('popover') popover: IonPopover;
  @ViewChild('modal') modal: IonModal;

  isOpen = false;
  loading: boolean = true;
  from: any = null;
  date: any = null;
  to: any = null;

  data: any;
  dataCount: any;
  constructor(
    private navCtrl: NavController,
    public authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    this.getAccount();
    this.getCounts();
  }

  getCounts(ev?: any) {
    this.loading = true;
    //`/api/sales/count?MANDOOB_CODE=${this.authService.userData.MANDOOB_CODE}&ACCOUNT_CODE=${this.authService.userData.ACCOUNT_CODE}`
    this.dataService.getData(this.endPoint).subscribe((res: any) => {
      console.log(res);
      this.dataCount = res.data;
      this.loading = false;
      if (ev) ev.target.complete();
    });
  }

  get endPoint(): string {
    let url = `/api/sales/count`;
    url += `?MANDOOB_CODE=${this.authService.userData.MANDOOB_CODE}`;
    url += `&ACCOUNT_CODE=${this.authService.userData.ACCOUNT_CODE}`;
    if (this.date)
      url += `&date=${new Date(this.date).toISOString().slice(0, 10)}`;
    if (this.from) url += `&from=${new Date(this.from).toISOString()}`;
    if (this.from && this.to) url += `&to=${new Date(this.to).toISOString()}`;
    return url;
  }

  getAccount() {
    this.dataService
      .getData(
        `/api/debt/getMyData/?code=${this.authService.userData.ACCOUNT_CODE}`
      )
      .subscribe((res: any) => {
        console.log(res);
        this.data = res.data;
        // this.data.BALANCE_CUR;
      });
  }
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }

  back() {
    this.navCtrl.back();
  }
  countList(body: any) {
    this.dataService.setParams(body);
    this.navCtrl.navigateForward(`tabs/count-list/${body[0]}`);
  }
  doRefresh(ev: any) {
    this.getCounts(ev);
  }
}
