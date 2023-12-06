import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-count-details',
  templateUrl: './count-details.page.html',
  styleUrls: ['./count-details.page.scss'],
})
export class CountDetailsPage implements OnInit {
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

    this.BILL_NUMBER = await this.route.snapshot.params['id'];
    // this.items = await this.dataService.params.bill?.DETAILS;
    console.log(this.items);

    this.getDetails(this.BILL_NUMBER);
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
  back() {
    this.navCtrl.back();
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
            // item.QTY = ;

            this.cartService.returnItem({
              ITEM_CODE: item.ITEM_CODE,
              TIME_USE: item.TIME_USE,
              IS_TRANS: item.IS_TRANS,
              ITEM_BARCODE: item.ITEM_BARCODE,
              ITEM_NAME: item.ITEM_NAME,
              TYPE_CODE: item.TYPE_CODE,
              UNIT_CODE: item.UNIT_CODE,
              UNIT_QTY: item.UNIT_QTY,
              UNIT_NAME: item.UNIT_NAME,
              BALANCE: item.BALANCE,
              DF_SALE: item.DF_SALE,
              DF_STORE: item.DF_STORE,
              DF_BUY: item.DF_BUY,
              FULL_NAME: item.FULL_NAME,
              PRICE_BUY: item.PRICE_BUY,
              PRICE_COST: item.PRICE_COST,
              PRICE_SALE_1: item?.TOTAL_MANDOOB_ITEM + item.TOTAL,
              PRICE_SALE_2: item?.TOTAL_MANDOOB_ITEM + item.TOTAL,
              PRICE_SALE_3: item?.TOTAL_MANDOOB_ITEM + item.TOTAL,
              totalPriceMandob: item?.TOTAL_MANDOOB_ITEM + item.TOTAL,
              PRICE_AVG_COST: item.PRICE_AVG_COST,
              PRICE_SALE_CUR: item.PRICE_SALE_CUR,
              CATEGORY_CODE: item.CATEGORY_CODE,
              CATEGORY_NAME: item.CATEGORY_NAME,
              STORE_CODE: 2,
              STORE_NAME: item.STORE_NAME,
              IS_USED: true,
              ITEM_NAME_EN: item.ITEM_NAME_EN,
              ITEM_NOTE: item.ITEM_NOTE,
              ITEM_NOTE_EN: item.ITEM_NOTE_EN,
              IMG_URL: item.IMG_URL,
              CATEGORY_NAME_EN: item.CATEGORY_NAME_EN,
              CATEGORY_IMAGE_PATH: item.CATEGORY_IMAGE_PATH,
              ID_APPLICATION: item.ID_APPLICATION,
              RAF_NAME: item.RAF_NAME,
              IS_DISCOUNT: item.IS_DISCOUNT,
              MAIN_ITEM_CODE: item.MAIN_ITEM_CODE,
              IS_FEATURE: item.IS_FEATURE,
              DISC_PERCENT: item.DISC_PERCENT,
              DISC_AMO: item.DISC_AMO,
              ITEM_PARENT: item.ITEM_PARENT,
              ITEM_SUB_PARENT: item.ITEM_SUB_PARENT,
              LEVEL_SUB: item.LEVEL_SUB,
              AREA_M2: item.AREA_M2,
              WIDTH_CM: item.WIDTH_CM,
              LENGTH_CM: item.LENGTH_CM,
              COMPANY_CREATE: item.COMPANY_CREATE,
              EFFECTIVE_MATERIAL: item.EFFECTIVE_MATERIAL,
              QTY: item.QTY * -1,
            });
            this.helpers.presentToast('تم الاضافة الي السلة للاسترجاع');
            this.navCtrl.navigateRoot('tabs/pages/home');
          },
        },
      ],
    });

    await alert.present();
  }
}
