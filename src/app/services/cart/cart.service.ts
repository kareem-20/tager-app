import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
const ITEMS = 'items';
const FAV = 'fav';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private clear: boolean = false;
  items: any[] = [];
  public fav: any[] = [];

  totalPrice: number;
  clientPrice: number;
  cartCount: BehaviorSubject<number> = new BehaviorSubject(0);
  deliveryCost: number;
  constructor(private storage: Storage) {}

  async reloadCart() {
    this.items = (await this.storage.get(ITEMS)) || [];
    this.cartCount.next(this.items.length);

    const fav = await this.storage.get(FAV);
    fav == null ? (this.fav = []) : (this.fav = fav);
  }

  updateCart(item: any) {
    let filter = this.items.filter((el) => el.ITEM_CODE == item.ITEM_CODE);
    item.QTY ? (filter[0].QTY = item.QTY) : this.deleteItem(item);
    this.saveStorage();
  }

  addItem(item: any) {
    if (!item.QTY) item.QTY = 1;
    this.items.push(item);
    this.saveStorage();
  }

  checkEachItem(item: any) {
    for (let p of this.items) {
      if (item.ITEM_CODE == p.ITEM_CODE) {
        item.QTY = p.QTY;
        return true;
      }
    }
  }
  getItemCart(item: any) {
    let filter = this.items.filter((p) => p.ITEM_CODE == item.ITEM_CODE);
    if (filter[0]) {
      item.QTY = filter[0].QTY;
      item.addedToCart = true;
    }
  }
  checkEachSlide(slide: any) {
    let filter = this.items.filter(
      (item) => item.ITEM_CODE == slide?.product?.ITEM_CODE
    );
    if (filter.length) return (slide.product.QTY = filter[0].QTY);
  }

  async deleteItem(item: any) {
    this.items = this.items.filter((i) => i.ITEM_CODE !== item.ITEM_CODE);
    await this.saveStorage();
  }

  private async saveStorage() {
    await this.storage.set(ITEMS, this.items);
    this.cartCount.next(this.items.length);
  }

  async clearCart() {
    this.items = [];
    await this.storage.set(ITEMS, []);
    this.cartCount.next(0);
  }

  get cartPrice() {
    return this.items.reduce((acc, el) => acc + el.price * el.QTY, 0);
  }

  get count() {
    return this.cartCount.asObservable();
  }

  toggleFav(item: any) {
    if (item?.favorite) {
      this.fav.push(item);
    } else {
      this.fav = this.fav.filter((f) => f.ITEM_CODE != item.ITEM_CODE);
    }
    return this.storage.set(FAV, this.fav);
  }
  getItemFavourit(item: any) {
    let filter = this.fav.filter((p) => p.ITEM_CODE == item.ITEM_CODE);
    if (filter[0]) {
      item.favorite = true;
    }
  }
}
