import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
const ITEMS = 'items';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private clear: boolean = false;
  items: any[] = [];
  totalPrice: number;
  clientPrice: number;
  cartCount: BehaviorSubject<number> = new BehaviorSubject(0);
  deliveryCost: number;
  constructor(private storage: Storage) {}

  async reloadCart() {
    this.items = (await this.storage.get(ITEMS)) || [];
    this.cartCount.next(this.items.length);
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
      if (item._id == p._id) {
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
    let filter = this.items.filter((item) => item._id == slide?.product?._id);
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
}
