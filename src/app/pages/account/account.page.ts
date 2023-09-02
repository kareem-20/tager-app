import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  nav(route) {
    this.navCtrl.navigateForward(route);
  }

  logOut() {
    this.authService.logOut();
  }
}
