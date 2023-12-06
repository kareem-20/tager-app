import { FunctionsService } from './../../services/functions/functions.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  cart: any;
  clients: any[] = [];
  currentClient: number;
  loading = true;
  emptyView = false;
  errorView = false;
  search_txt: string = '';
  constructor(
    private navCtrl: NavController,
    private functionsService: FunctionsService,
    private dataService: DataService,
    private alertCtrl: AlertController,
    private cartService: CartService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getClients();
  }
  choose(client: number) {
    this.currentClient = client;
  }

  async deleteClient(client: any, index: number) {
    const alert = await this.alertCtrl.create({
      header: 'تأكيد عملية الحذف',
      message: 'هل تريد حذف هذا الزبون؟',
      mode: 'ios',
      buttons: [
        {
          text: 'الغاء',
          role: 'cancel',
        },
        {
          text: 'حذف',
          handler: () => {
            this.dataService
              .deleteData(`/api/receverOrder/delete/${client.T_ID}`)
              .subscribe((res) => {
                this.functionsService.presentToast('تم الحذف بنجاح');
                this.getClients();
                this.clients.splice(index, 1);
                if (this.currentClient == client) this.currentClient = 0;
              });
          },
        },
      ],
    });
    await alert.present();

    console.log(this.currentClient);
  }

  back() {
    this.navCtrl.pop();
  }
  nav(path: string) {
    this.navCtrl.navigateForward(path);
  }

  editClient(client: any) {
    this.dataService.setParams({
      ...this.dataService.params,
      client: client,
    });
    this.navCtrl.navigateForward('/add-client');
  }

  getClients(ev?: any) {
    let url = '/api/receverOrder/get/';
    if (this.search_txt.trim().length)
      url += `?search_txt=${this.search_txt.trim()}`;
    this.dataService.getData(url).subscribe(
      (res: any) => {
        this.clients = res.data;
        console.log(this.clients);
        if (this.clients.length) this.showContent(ev);
        else this.showEmptyView(ev);
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }

  showContent(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = false;
    if (ev) ev.target.complete();
  }

  showErrorView(ev?: any) {
    this.loading = false;
    this.errorView = true;
    this.emptyView = false;
    if (ev) ev.target.complete();
  }

  showEmptyView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = true;
    if (ev) ev.target.complete();
  }

  async showSearchBar() {
    const alert = await this.alertCtrl.create({
      header: 'بحث',
      message: 'ابحث برقم الهاتف',
      inputs: [
        {
          type: 'text',
          name: 'phone',
        },
      ],
      buttons: [
        {
          text: 'الغاء',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'بحث',
          handler: () => {
            console.log('Confirm Okay');
          },
        },
      ],
    });

    await alert.present();
  }

  confirm() {
    this.dataService.setParams({
      ...this.dataService.params,
      client: this.currentClient,
    });
    this.navCtrl.navigateForward('/send-order');
  }
}
