import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
  styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage implements OnInit {
  cityes: any[] = [
    { _id: 1, name: 'بغداد' },
    { _id: 2, name: 'الموصل' },
  ];
  form: FormGroup;
  selectedZone: any;
  client: any = null;
  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private dataService: DataService,
    private functionsService: FunctionsService
  ) {
    this.selectedZone = this.dataService.params.selectedZone;

    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      PHONE_1: [''],
      PHONE_2: [''],
      RECEVER_NAME: [''],
      ZONE_NAME: [this.selectedZone.REGION_NAME],
      ADDRESS: [''],
      NOTE: [''],
    });
  }
  ngOnInit() {
    // this.selectedZone = this.dataService.params.selectedZone;
  }
  ionViewWillEnter() {
    this.client = this.dataService.params.client;
    if (this.client) {
      this.form.patchValue(this.client);
    }
  }
  back() {
    this.navCtrl.pop();
  }
  nav(path: string) {
    this.navCtrl.navigateForward(path);
  }
  save() {
    let body = { ...this.form.value };
    if (this.client) {
      body = { ...body, T_ID: this.client.T_ID };

      this.dataService
        .editData('/api/receverOrder/update', body)
        .subscribe((res) => {
          console.log(res);
          this.functionsService.presentToast('تم التعديل بنجاح');
          this.navCtrl.navigateBack('clients');
        });
    } else {
      this.dataService
        .postData('/api/receverOrder/insert', body)
        .subscribe((res) => {
          console.log(res);
          this.functionsService.presentToast('تمت الاضافة بنجاح');
          this.navCtrl.navigateBack('clients');
        });
    }
  }
  ngOnDestroy(): void {
    this.dataService.setParams({ ...this.dataService.params, client: null });
  }
}
