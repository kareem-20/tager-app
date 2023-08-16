import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  products: any[] = [1, 2, 3, 4];
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}
  back() {
    this.navCtrl.back();
  }
}
