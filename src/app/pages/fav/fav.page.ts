import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.page.html',
  styleUrls: ['./fav.page.scss'],
})
export class FavPage implements OnInit {
  offers: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  items: any[] = [];
  id: string;
  cat: any;
  loading = false;
  emptyView = false;
  errorView = false;
  skip: number = 1;
  search_txt: string = '';

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  back() {
    this.navCtrl.back();
  }
}
