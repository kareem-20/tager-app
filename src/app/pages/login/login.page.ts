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
  form: FormGroup;
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private alertCtrl: AlertController
  ) {
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
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

  toggoleType() {
    this.type == 'password' ? (this.type = 'text') : (this.type = 'password');
    console.log(this.type);
  }

  submit() {
    this.authService.login(this.form.value);
  }
  nav(route) {
    this.navCtrl.navigateForward(route);
  }

  visitor() {
    this.authService.loginAsVisitor();
  }
}
