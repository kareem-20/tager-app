import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  type: string = 'password';
  form: FormGroup;

  constructor(
    private navCtrl: NavController,
    private functionsService: FunctionsService,
    private formBuilder: FormBuilder,
    private authService: AuthService
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

  submit() {
    if (this.form.value.password != this.form.value.rePassword)
      return this.functionsService.presentToast('كلمة السر غير متطابقة');
    this.authService.register(this.form.value);
  }
  toggoleType() {
    this.type = this.type == 'password' ? 'text' : 'password';
  }
}
