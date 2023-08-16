import { DataService } from 'src/app/services/data/data.service';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { from } from 'rxjs';
import { FunctionsService } from '../functions/functions.service';

const USER = 'user';
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  constructor(
    private dataService: DataService,
    private functionService: FunctionsService,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  async removeCredentials() {
    localStorage.removeItem(ACCESS_TOKEN);
    return await Promise.all([
      this.storage.remove(USER),
      this.storage.remove(REFRESH_TOKEN),
    ]);
  }

  getRefreshToken() {
    let promise = new Promise(async (resolve, reject) => {
      let token = await this.storage.get(REFRESH_TOKEN);
      this.dataService.getData('/user/refreshToken?token=' + token).subscribe(
        (res: any) => {
          localStorage.setItem(ACCESS_TOKEN, res.accessToken);
          resolve(res.token);
        },
        (e) => reject(e)
      );
    });
    return from(promise);
  }

  async login(body: any) {
    await this.functionService.showLoading();
    this.dataService.postData('/user/login', body).subscribe(
      async (user: any) => {
        await this.storage.set(USER, user);
        await this.storage.set(REFRESH_TOKEN, user.refreshToken);
        localStorage.setItem(ACCESS_TOKEN, user.accessToken);
        this.functionService.dismissLoading();
      },
      (err) => {
        this.functionService.dismissLoading();
        if (err.status == 404)
          return this.functionService.presentToast(
            'خطأ باسم المستخدم او كلمة المرور'
          );

        if (err.status == 403)
          return this.functionService.presentToast(
            'لقد تم تعطيل حسابك برجاء التواصل مع الشركة'
          );
        return this.functionService.presentToast('خطأ بالشبكة');
      }
    );
  }

  async loginWithBinCode(body: any) {
    this.functionService.showLoading();
    this.dataService.postData('/api/t_mandoob/login', body).subscribe(
      async (user: any) => {
        if (user.data[0]) {
          this.userData = await this.storage.set(USER, user.data[0]);
          this.functionService.presentToast('تم تسجيل الدخول بنجاح');
          this.navCtrl.navigateRoot('/');
        }

        this.functionService.dismissLoading();
      },
      (err) => {
        this.functionService.dismissLoading();
        if (err.status == 404)
          return this.functionService.presentToast(
            'خطأ باسم المستخدم او كلمة المرور'
          );

        if (err.status == 403)
          return this.functionService.presentToast(
            'لقد تم تعطيل حسابك برجاء التواصل مع الشركة'
          );
        return this.functionService.presentToast('خطأ بالشبكة');
      }
    );
  }

  async logOut() {
    await this.functionService.showLoading();
    await this.removeCredentials();
    this.functionService.dismissLoading();
    this.navCtrl.navigateRoot('/login');
  }

  userStatus() {
    this.dataService.getData(`/status`).subscribe(async (res: any) => {
      if (res.active) {
        await this.storage.set('user', res?.user);
        return;
      }
      this.functionService.presentToast(res.message);
      this.logOut();
    });
  }
}
