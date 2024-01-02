import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  closeBtn = false;
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
  async openLink(link) {
    // window.open(link, '_system');
    this.closeBtn = true;
    await Browser.open({ url: link, presentationStyle: 'popover' });
    await Browser.addListener('browserFinished', () => {
      this.closeBtn = false;
    });
  }
  async close() {
    this.closeBtn = false;
    await Browser.close();
  }
}
