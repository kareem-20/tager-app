import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  text;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.dataService.getMongoData('/help').subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.text = res.text;
        // this.id = res._id;
      }
    });
  }

  back() {
    this.navCtrl.back();
  }
}
