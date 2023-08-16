import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-done-order',
  templateUrl: './done-order.page.html',
  styleUrls: ['./done-order.page.scss'],
})
export class DoneOrderPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }


  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path)
    this.navCtrl.pop()
  }
  back() {
    this.navCtrl.navigateBack('/tabs')
  }
}
