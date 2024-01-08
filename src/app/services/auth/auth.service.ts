import { DataService } from 'src/app/services/data/data.service';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { from } from 'rxjs';
import { FunctionsService } from '../functions/functions.service';
import { FcmService } from '../fcm/fcm.service';

const USER = 'user';
const MONGO_USER = 'user-mongo';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  userMongoData: any;
  settings: any;

  constructor(
    private dataService: DataService,
    private functionService: FunctionsService,
    private storage: Storage,
    private fcm: FcmService,
    private navCtrl: NavController
  ) {}

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  async removeCredentials() {
    localStorage.removeItem(ACCESS_TOKEN);
    return await Promise.all([
      this.storage.remove(MONGO_USER),
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
    this.dataService.postMongoData('/user/login', body).subscribe(
      async (user: any) => {
        this.userMongoData = await this.storage.set(MONGO_USER, user);
        this.fcm.user = this.userMongoData;
        this.fcm.notificationsOne();

        await this.storage.set(REFRESH_TOKEN, user.refreshToken);
        localStorage.setItem(ACCESS_TOKEN, user.accessToken);
        this.functionService.dismissLoading();
        if (this.userMongoData.code)
          this.loginWithBinCode({ PIN_CODE: this.userMongoData.code });
        else this.navCtrl.navigateRoot('pending');
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

  async register(body: any) {
    await this.functionService.showLoading();
    this.dataService.postMongoData('/user/register', body).subscribe(
      async (user: any) => {
        this.userMongoData = await this.storage.set(MONGO_USER, user);
        console.log(user);
        this.fcm.user = this.userMongoData;
        this.fcm.notificationsOne();
        await this.storage.set(REFRESH_TOKEN, user.refreshToken);
        localStorage.setItem(ACCESS_TOKEN, user.accessToken);
        this.navCtrl.navigateRoot('pending');
        this.functionService.dismissLoading();
      },
      (err) => {
        this.functionService.dismissLoading();
        if (err.status == 404)
          return this.functionService.presentToast(
            'خطأ باسم المستخدم او كلمة المرور'
          );
        if (err.status == 409)
          return this.functionService.presentToast('اسم المستخدم موجود مسبقا');
        if (err.status == 403)
          return this.functionService.presentToast(
            'لقد تم تعطيل حسابك برجاء التواصل مع الشركة'
          );
        return this.functionService.presentToast('خطأ بالشبكة');
      }
    );
  }

  async loginWithBinCode(body: any) {
    await this.functionService.showLoading();

    this.dataService.postData('/api/t_mandoob/login', body).subscribe(
      async (user: any) => {
        if (user.data[0]) {
          this.userData = await this.storage.set(USER, user.data[0]);
          this.functionService.presentToast('تم تسجيل الدخول بنجاح');
          this.navCtrl.navigateRoot('/tabs/home');
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

  async logOutMongo() {
    await this.storage.remove(MONGO_USER);
    await this.fcm.unsubscribeOne();
    this.navCtrl.navigateRoot('login');
  }
  userStatus() {
    this.dataService
      .getMongoData(`/user/status/${this.userMongoData._id}`)
      .subscribe(async (res: any) => {
        this.userMongoData = await this.storage.set(MONGO_USER, res);
        if (res.code) {
          this.loginWithBinCode({ PIN_CODE: res.code });
        } else {
          this.navCtrl.navigateRoot('pending');
        }
      });
  }
  async updateUser(body: any) {
    await this.functionService.showLoading();
    this.dataService
      .editMongoData(`/user/${this.userMongoData?._id}`, body)
      .subscribe(
        async (user: any) => {
          this.userMongoData = await this.storage.set(MONGO_USER, user);
          await this.storage.set(REFRESH_TOKEN, user.refreshToken);
          localStorage.setItem(ACCESS_TOKEN, user.accessToken);
          this.functionService.presentToast('تم تحديث البيانات بنجاح');
          this.functionService.dismissLoading();
          this.navCtrl.navigateForward('/tabs/home');
        },
        (err) => {
          this.functionService.dismissLoading();
          // if (err.status == 404)
          //   return this.functionService.presentToast('خطأ برقم الهاتف او كلمة المرور');
          // if (err.status == 409)
          //   return this.functionService.presentToast('اسم المستخدم موجود بالفعل ');
          return this.functionService.presentToast('خطأ بالشبكة');
        }
      );
  }
  async getSettings() {
    this.dataService.getMongoData('/settings').subscribe(
      (res) => {
        console.log(res);
        this.settings = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  async loginAsVisitor() {
    if (!this.settings.visitorCode?.length)
      this.functionService.presentToast('غير متاح حاليا');
    else {
      this.loginWithBinCode({ PIN_CODE: this.settings.visitorCode });
      this.userMongoData = await this.storage.set(MONGO_USER, 'visitor');
    }
  }
}
