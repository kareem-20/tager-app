import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any[] = [];
  loading = true;
  emptyView = false;
  errorView = false;
  search_txt: string = '';
  constructor(
    private dataService: DataService,
    private navCtrl: NavController
  ) {}
  ngOnInit() {
    this.getCategory();
  }
  getCategory(ev?: any) {
    let url = '/api/category/get/';
    if (this.search_txt.trim().length)
      url += `?search_txt=${this.search_txt.trim()}`;
    this.dataService.getData(url).subscribe(
      (res: any) => {
        console.log(res);
        this.categories = res.data;
        if (this.categories.length) this.showContent(ev);
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
  categoryProducts(cat: any) {
    this.dataService.setParams({ cat });
    this.navCtrl.navigateForward(`/products/${cat.CATEGORY_CODE}`);
  }
  doRefresh(ev: any) {
    this.search_txt = '';
    this.getCategory(ev);
  }
  back() {
    this.navCtrl.back();
  }
}
