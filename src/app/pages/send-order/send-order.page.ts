import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-send-order',
  templateUrl: './send-order.page.html',
  styleUrls: ['./send-order.page.scss'],
})
export class SendOrderPage implements OnInit {
  clientPrice: number;
  totalPrice: number;
  items: any[] = [];
  client: any;
  device: any;
  deliveryCost: number;
  selectedZone: any;
  paidCash: number;
  constructor(
    private navCtrl: NavController,
    private cartService: CartService,
    private dataService: DataService,
    private authService: AuthService,
    private functionsService: FunctionsService
  ) {}

  async ngOnInit() {
    this.device = (await Device.getId()).identifier;
    console.log(this.device);
  }

  ionViewWillEnter() {
    this.items = this.cartService.items;
    this.totalPrice = this.cartService.totalPrice;
    this.clientPrice = this.cartService.clientPrice;
    this.client = this.dataService.params.client;
    this.paidCash = this.cartService.paidCash;
    this.deliveryCost = this.cartService.deliveryCost;
    this.selectedZone = this.dataService.params.selectedZone;

    console.log(this.dataService.params);
    console.log(this.createBody());
  }

  back() {
    this.navCtrl.pop();
  }
  nav(path: string) {
    this.navCtrl.navigateForward(path);
  }

  async createBody() {
    const body = {
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toISOString().slice(0, 16),
      info: JSON.stringify({
        INVOICE_CODE: 6,
        CLIENT_CODE: 2100001,
        CLIENT_NAME: this.client?.RECEVER_NAME,
        CLIENT_PHONE: this.client?.PHONE_1,
        CLIENT_ADDRESS: this.client?.ADDRESS,
        CLIENT_ZONE: this.client?.ZONE_NAME,
        CLIENT_NOTE: this.client?.NOTE,
        MANDOOB_CODE: this.authService.userData.MANDOOB_CODE,
        LAT: '',
        LNG: '',
        NOTE_ORDER: this.client?.NOTE,
        TOTAL_DISCOUNT: 0,
        TOTAL: this.clientPrice,
        SERVICE: 0,
        TOTAL_CASH: 0,
        DELIVERYCOST: this.deliveryCost,
        USER_CREATE: 'online',
        CASH_PAID: 0,
        CASH_AMO: 0,
        REMAIN_AMO: 0,
        USER_CODE: 10,
        INVOICE_STATUS: 1,
        REGION_CODE: this.selectedZone?.REGION_CODE,
      }),
      details: this.cartDetail, //JSON.stringify(this.cartService.cart),
      is_insert: 0,
      b_code: 2,
      bill_giud: 'any GIUD',
      bill_number: 0,
      bill_branch: this.authService.userData.MANDOOB_CODE,
      user_create: 'online',
      device_id: this.device,
      is_accept: 0,
      token_app: '[APP_TOKEN]',
      client_name: `${this.client.RECEVER_NAME}`,
      client_phone: `${this.client.PHONE_1}`,
      client_address: `${this.client.ADDRESS}`,
      branch: 'SP',
      b_name: 'b_name',
      userId: this.authService.userData?.ACCOUNT_CODE,
    };
    return body;
  }

  get cartDetail() {
    const details = [];
    for (let item of this.items) {
      details.push({
        ITEM_CODE: item.ITEM_CODE,
        ITEM_NAME: item.ITEM_NAME,
        QTY: item.QTY,
        UNIT_NAME: item.UNIT_NAME,
        UNIT_QTY: item.UNIT_QTY,
        STORE_CODE: item.STORE_CODE,
        PRICE_COST: item.PRICE_COST,
        PRICE: item.PRICE_SALE_1,
        totalPriceMandob: item.totalPriceMandob
          ? item.totalPriceMandob
          : item?.price * item.QTY,
        totalNetProfitMandob:
          item?.price * item.QTY - item.PRICE_SALE_1 * item.QTY,
        PRICE_SALE_1: item.PRICE_SALE_1,
        PRICE_SALE_2: item.PRICE_SALE_2,
        PRICE_SALE_3: item.PRICE_SALE_3,
        ITEM_NOTE: item.ITEM_NOTE || '',
        NOTE: '',
        IMG_URL: item.IMG_URL,
        DISC_PERCENT: 0,
        DISC_AMO: 0,
      });
    }
    details.push({
      ITEM_CODE: -1,
      ITEM_NAME: 'اجور توصيل',
      QTY: 1,
      UNIT_NAME: 'خدمة',
      UNIT_QTY: 1,
      STORE_CODE: this.items[0].STORE_CODE,
      PRICE_COST: this.selectedZone?.REGION_COST,
      PRICE: this.selectedZone?.REGION_SELL + this.paidCash,
      PRICE_SALE_1: this.selectedZone?.REGION_SELL,
      PRICE_SALE_2: 0,
      totalPriceMandob: this.selectedZone?.REGION_SELL,
      totalNetProfitMandob:
        this.selectedZone?.REGION_SELL -
        (this.selectedZone?.REGION_SELL + this.paidCash),
      PRICE_SALE_3: 0,
      ITEM_NOTE: '',
      NOTE: '',
      IMG_URL: '',
      DISC_PERCENT: 0,
      DISC_AMO: 0,
    });
    return JSON.stringify(details);
  }

  // POST DATA
  async postData() {
    await this.functionsService.showLoading();
    const body = await this.createBody();
    console.log(body);

    this.dataService.postData('/api/invoice/add', body).subscribe(
      (res) => {
        console.log(res);

        this.functionsService.dismissLoading();
        this.cartService.clearCart();
        this.dataService.setParams({});
        this.navCtrl.navigateRoot('tabs/home');
        this.functionsService.presentToast('تم ارسال الطلب بنجاح');
      },
      (_) => {
        this.functionsService.dismissLoading();
        this.functionsService.presentToast('خطأ بالشبكة يرجي المحاوله لاحقا');
      }
    );
  }
}
