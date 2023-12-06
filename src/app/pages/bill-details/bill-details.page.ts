import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.page.html',
  styleUrls: ['./bill-details.page.scss'],
})
export class BillDetailsPage implements OnInit {
  items: any[] = [];
  BILL_NUMBER: string;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private helpers: FunctionsService,
    private cartService: CartService,
    private dataService: DataService
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    console.log(this.dataService.params.bill);

    this.BILL_NUMBER = this.dataService.params.bill?.T_ID;
    this.items = await this.dataService.params.bill?.DETAILS;
    console.log(this.items);

    // this.getDetails(this.BILL_NUMBER);
  }
  getDetails(BILL_NUMBER: string) {
    this.dataService
      .getData(`/api/salesDetails/get?BILL_NUMBER=${BILL_NUMBER}`)
      .subscribe((res: any) => {
        this.items = res.data;
        console.log(res);
      });
  }
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }

  async return(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'استرجاع',
      message: 'هل تريد استرجاع هذا المنتج؟',
      buttons: [
        {
          text: 'الغاء',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'استرجاع',
          handler: () => {
            item.QTY = item.QTY * -1;
            item.STORE_CODE = 2;

            this.cartService.returnItem(item);
            this.helpers.presentToast('تم الاضافة الي السلة للاسترجاع');
          },
        },
      ],
    });

    await alert.present();
  }
}
