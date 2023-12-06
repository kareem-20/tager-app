import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notification: any[] = [];
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  disableInfinity: boolean = false;
  skip: number = 0;
  userData: any;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.userData = this.authService.userData;
  }
  ionViewWillEnter() {
    this.getNotification();
  }
  getNotification(ev?: any) {
    this.dataService.getMongoData(this.endPoint).subscribe(
      (res: any) => {
        console.log(res);

        this.notification = this.skip ? this.notification.concat(res) : res;
        this.notification.length
          ? this.showContentView(ev)
          : this.showEmptyView(ev);
        this.disableInfinity = res?.length == 0;
      },
      (err) => {
        this.showErrorView();
      }
    );
  }
  nav(route: string) {
    this.navCtrl.navigateForward(route);
  }

  get endPoint() {
    let url = `/fcm/`;
    // ?phone=${this.userData.phone}
    if (this.skip) url += `?skip=${this.skip}`;

    return url;
  }
  doRefresh(ev?: any) {
    this.getNotification();
    ev.target.complete();
  }
  showContentView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = false;
    this.disableInfinity = false;
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

  loadData(ev?: any) {
    this.skip += 1;
    this.getNotification(ev);
  }
  back() {
    this.navCtrl.back();
  }
}
