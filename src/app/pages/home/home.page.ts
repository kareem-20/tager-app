import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';
import SwiperCore, { Autoplay, Keyboard, Pagination } from 'swiper';
import { IonicSlides, NavController } from '@ionic/angular';
SwiperCore.use([Autoplay, Pagination, Keyboard, IonicSlides]);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  products: any[] = [1, 2, 3, 4, 5, 6];
  categories: any[] = [1, 2, 3, 4, 5, 6];
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }
}
