import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Storage } from '@ionic/storage-angular';
import { FunctionsService } from './services/functions/functions.service';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { CartService } from './services/cart/cart.service';

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
    private navCtrl: NavController
  ) {
    this.initApp();
  }

  async initApp() {
    await this.platform.ready();
    // await this.functionsService.setStatusBar(Style.Light, '#ffffff', false);
    await this.storage.create();
    await this.cartService.reloadCart();
    // await this.checkUser();
    // await SplashScreen.hide();
  }
}
