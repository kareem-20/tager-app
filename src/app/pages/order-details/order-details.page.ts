import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  BILL_NUMBER: string;
  items: any[] = [];
  bill: any;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    console.log(this.dataService.params.bill);

    this.BILL_NUMBER = await this.route.snapshot.params['id'];
    this.items = await this.dataService.params.bill?.DETAILS;
    this.bill = this.dataService.params.bill;
    console.log(this.items);

    this.getDetails(this.BILL_NUMBER);
  }
  getDetails(BILL_NUMBER: string) {
    this.dataService
      .getData(`/api/salesDetails/get?BILL_NUMBER=${BILL_NUMBER}`)
      .subscribe((res: any) => {
        this.BILL_NUMBER = res.data;
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
}
