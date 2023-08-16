import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-balance-account',
  templateUrl: './balance-account.page.html',
  styleUrls: ['./balance-account.page.scss'],
})
export class BalanceAccountPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  back() {
    this.navCtrl.back();
  }
}
