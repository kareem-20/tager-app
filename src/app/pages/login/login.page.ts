import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  type = 'password';
  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'تسجيل الدخول',
      message: 'ادخل الكود الخاص بك',
      mode: 'ios',
      inputs: [
        {
          type: 'text',
          name: 'PIN_CODE',
        },
      ],
      buttons: [
        {
          text: 'ارسال',
          handler: async (val) => {
            console.log(val);
            await this.authService.loginWithBinCode(val);
            // this.userData = this.authService.userData;
          },
        },
        {
          text: 'الغاء',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }
}
