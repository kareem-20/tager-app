import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

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
    private formBuilder: FormBuilder
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
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  toggoleType() {
    this.type = this.type == 'password' ? 'text' : 'password';
  }
}
