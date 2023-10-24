import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import {
  parsePhoneNumber,
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  type: string = 'password';
  form: FormGroup;
  isOpen: boolean = false;
  code: any;
  settings: any;
  constructor(
    private navCtrl: NavController,
    private functionsService: FunctionsService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private alertCtrl: AlertController
  ) {
    this.createForm();
  }

  ngOnInit() {}
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }
  createForm() {
    this.form = this.formBuilder.group({
      displayName: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
    });
  }
  ionViewWillEnter() {
    this.settings = this.authService.settings;
  }
  async showAlert() {
    let valid = this.validPhoneNumber(this.form.value.phone);
    if (!valid)
      return this.functionsService.presentToast('رقم الهاتف غير صحيح');
    const alert = await this.alertCtrl.create({
      message: 'سيتم ارسال رسالة علي رقم الهاتف للتأكيد',
      mode: 'ios',
      buttons: [
        {
          text: 'ارسال',
          handler: () => {
            this.sendCode();
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

  validPhoneNumber(number: string) {
    return parsePhoneNumber(number, 'IQ').isValid();
  }
  async sendCode() {
    await this.functionsService.showLoading('جاري ارسال الكود');
    this.dataService
      .postMongoData('/sms/send', { phone: this.form.value.phone })
      .subscribe(
        (res) => {
          console.log(res);
          this.isOpen = true;
          this.functionsService.dismissLoading();
          this.functionsService.presentToast('تم ارسال الكود لرقمك');
        },
        (err) => {
          console.log(err);
          this.functionsService.dismissLoading();
          this.functionsService.presentToast('خطأ بالارسال');
        }
      );
  }
  async vertifyCode() {
    await this.functionsService.showLoading('جاري التحقق من الكود');
    this.dataService
      .postMongoData('/sms/confirm', {
        phone: this.form.value.phone,
        code: this.code,
      })
      .subscribe(
        (res) => {
          console.log(res);
          this.isOpen = false;
          this.functionsService.dismissLoading();
          this.functionsService.presentToast('تم التأكيد بنجاح');
          this.register();
        },
        (err) => {
          this.functionsService.dismissLoading();
          this.functionsService.presentToast('كود غير صحيح');
        }
      );
  }
  submit() {
    if (this.form.value.password != this.form.value.rePassword)
      return this.functionsService.presentToast('كلمة السر غير متطابقة');
    if (this.settings.smsStatus == true) this.showAlert();
    else this.register();
  }
  register() {
    this.authService.register(this.form.value);
  }
  toggoleType() {
    this.type = this.type == 'password' ? 'text' : 'password';
  }
}
