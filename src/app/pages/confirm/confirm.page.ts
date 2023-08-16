import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  test: number;

  items: any[] = [
    { salary: null, qty: 2, min: 10, max: 20 },
    { salary: null, qty: 4, min: 10, max: 20 },
  ];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  get disableBtn(): Boolean {
    const value = !this.items.every(
      (item) =>
        item.salary < item.max && item.salary > item.min && item.salary != null
    );
    return value;
  }

  back() {
    this.navCtrl.pop();
  }
  nav(path: string) {
    this.navCtrl.navigateForward(path);
  }
}
