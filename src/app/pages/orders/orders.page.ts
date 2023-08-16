import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  constructor(private navCtrl: NavController) {}
  orders: any[] = [1, 2, 3, 4];
  ngOnInit() {}

  back() {
    this.navCtrl.back();
  }
}
