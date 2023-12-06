import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';
import { Share } from '@capacitor/share';

import { WritefileService } from 'src/app/services/writefile/writefile.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { ShareService } from 'src/app/services/share/share.service';
import { Clipboard } from '@capacitor/clipboard';
import { Media, MediaSaveOptions } from '@capacitor-community/media';
import Swiper from 'swiper';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  products: any[] = [];
  photos: any[] = [];
  // slideOpts = {
  //   slidesPerView: 1,
  //   autoplay: true,
  // };
  product: any;
  QTY: number = 1;
  @ViewChild('swiper')
  swiperRef: any | undefined;
  swiper?: Swiper;
  slideOpts = {
    // slidesPerView: 1.09,
    // spaceBetween: 10,
    // autoplay: true,
    autoplay: true,
    slidesPerView: 1,
    spaceBetween: 12,
    pagination: true,
  };
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private writeFileService: WritefileService,
    private functionsService: FunctionsService,
    private actionCtrl: ActionSheetController,
    private shareService: ShareService,
    private cartService: CartService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.product = this.dataService.params.prod;
    this.QTY = this.product.QTY || 1;
    this.getImages(this.product.ITEM_CODE);
    // this.getSimilar(this.product.CATEGORY_CODE);
    console.log(this.product);
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  getImages(itemCode: number) {
    this.dataService
      .getData(`/api/item/get-images/?item_code=${itemCode}`)
      .subscribe((res: any) => {
        console.log(res);
        this.photos = res.data;
        setTimeout(() => {
          const element = this.swiperRef.nativeElement.swiper;

          element.slideTo(1, 600);
          element?.update();
        }, 1000);
      });
  }
  increse() {
    this.QTY++;
  }
  decrese() {
    if (this.QTY > 1) this.QTY--;
  }
  getSimilar(itemCode: number) {
    this.dataService
      .getData(`/api/item/get-paginate/?cat_id=${itemCode}&page=1`)
      .subscribe((res: any) => {
        console.log(res);
        this.products = res.data.items;
        this.products.filter((item) => {
          item.ITEM_CODE != this.product.ITEM_CODE;
        });
        this.checkItemsFav(this.products);
        this.checkItemsCart(this.products);
      });
  }
  checkItemsCart(items: any[]) {
    for (let item of items) {
      this.cartService.getItemCart(item);
    }
  }
  checkItemsFav(items: any[]) {
    for (let item of items) {
      this.cartService.getItemFavourit(item);
    }
  }
  toggleFav(item: any) {
    item.favorite = !item?.favorite;
    this.cartService.toggleFav(item);
  }
  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }

  details(prod: any) {
    console.log(prod);
    this.dataService.setParams({ prod });
    this.navCtrl.navigateForward('product-details');
  }

  addItem(product: any) {
    product.QTY = this.QTY;
    this.cartService.addItem(product);
    product.addedToCart = true;
  }

  updateQty(product: any) {
    product.QTY = this.QTY;
    this.cartService.updateCart(product);
  }
  back() {
    this.navCtrl.back();
  }

  async share() {
    await Share.share({
      url: this.product?.IMG_URL,
      title: this.product?.ITEM_NAME,
      text: this.product?.ITEM_NOTE,
    }).catch((reason) => {
      console.log(reason);
    });
  }

  async showActionSheet(img) {
    const action = await this.actionCtrl.create({
      header: 'حفظ',
      mode: 'ios',
      buttons: [
        {
          text: 'حفظ صورة واحدة',
          handler: () => {
            // await this.downloadImage(img);
            // this.generateImage();
            // await saveAs.saveAs(img, 'image.jpg');\
            this.downloadImage(img);
          },
        },
        {
          text: 'حفظ كل الصور',
          handler: () => {
            this.saveAllImg();
          },
        },
        {
          text: 'الغاء',
          role: 'cancel',
        },
      ],
    });
    await action.present();
  }

  async downloadImage(imageUrl) {
    // const response = await fetch(
    //   `http://209.250.237.58:5640/proxy${
    //     imageUrl.split('https://gssc.esa.int')[1]
    //   }`
    // );
    // convert to a Blob
    // const blob = await response.blob();
    // convert to base64 data, which the Filesystem plugin requires
    // const base64Data = (await this.convertBlobToBase64(blob)) as string;
    let albums = (await Media.getAlbums()).albums;
    let exsistFolder = albums.find((item) => item.name.includes('tager'));
    if (!exsistFolder) await Media.createAlbum({ name: 'tager' });
    let albumsafter = (await Media.getAlbums()).albums;
    let downloadFolder = albumsafter.find((item) =>
      item.name.includes('tager')
    );

    let opt: MediaSaveOptions = {
      path: `http://209.250.237.58:5640/proxy${
        imageUrl.split('https://gssc.esa.int')[1]
      }`,
      albumIdentifier: downloadFolder.identifier,
    };
    await Media.savePhoto(opt)
      .then((res) => {
        console.log('then ==>', res);
        this.functionsService.presentToast('تم الحفظ');
      })
      .catch((err) => {
        console.log('err ==>', err);
        this.functionsService.presentToast('خطأ بالحفظ');
      });
  }
  async saveAllImg() {
    let promises: any[] = [];

    let albums = (await Media.getAlbums()).albums;
    let exsistFolder = albums.find((item) => item.name.includes('tager'));
    if (!exsistFolder) await Media.createAlbum({ name: 'tager' });
    let albumsafter = (await Media.getAlbums()).albums;
    let downloadFolder = albumsafter.find((item) =>
      item.name.includes('tager')
    );

    this.photos.forEach((img) => {
      let opt = {
        path: `http://209.250.237.58:5640/proxy${
          img.IMAGE_PATH_ONLINE.split('https://gssc.esa.int')[1]
        }`,
        albumIdentifier: downloadFolder.identifier,
      };

      promises.push(Media.savePhoto(opt));
    });

    await Promise.all(promises)
      .then((res) => {
        console.log('then ==>', res);
        this.functionsService.presentToast('تم الحفظ');
      })
      .catch((err) => {
        console.log('err ==>', err);
        this.functionsService.presentToast('خطأ بالحفظ');
      });
  }
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async copy() {
    await Clipboard.write({
      string: this.product?.ITEM_NOTE,
    }).then((val) => {
      this.functionsService.presentToast('تم نسخ مواصفات المنتج');
    });
  }
}
