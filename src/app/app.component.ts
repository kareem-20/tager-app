import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Storage } from '@ionic/storage-angular';
import { FunctionsService } from './services/functions/functions.service';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { CartService } from './services/cart/cart.service';
import { Style } from '@capacitor/status-bar';
import { AuthService } from './services/auth/auth.service';
import { FcmService } from './services/fcm/fcm.service';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private functionsService: FunctionsService,
    private storage: Storage,
    private cartService: CartService,
    private authService: AuthService,
    private fcmService: FcmService,

    private navCtrl: NavController
  ) {
    this.initApp();
  }

  async initApp() {
    await this.platform.ready();
    await this.functionsService.setStatusBar(Style.Light, '#ffffff', false);
    await this.storage.create();
    await this.fcmService.initPush();
    await this.cartService.reloadCart();
    await this.authService.getSettings();

    await this.checkUser();
  }

  async checkUser() {
    this.authService.userData = await this.storage.get('user');
    this.authService.userMongoData = await this.storage.get('user-mongo');
    if (this.authService.userMongoData) {
      this.authService.userStatus();
      // if (this.authService.userData) {
      //   this.navCtrl.navigateRoot('/tabs/home');
      // } else {
      //   this.navCtrl.navigateRoot('pending');
      // }
    } else this.navCtrl.navigateRoot('login');
  }
}
