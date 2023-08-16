import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  private isLoading:boolean = false;

  constructor(
    private alertCtrl:AlertController,
    private toastCtrl:ToastController,
    private loadingCtrl:LoadingController,
    private platForm: Platform
  ) { }

    async showLoading(message= 'برجاء الانتظار...') {
      if(this.isLoading) return ;
      this.isLoading = true;
      const loading = await this.loadingCtrl.create({
        message,
        mode: 'ios',
        cssClass: 'loading-class',
      });

      await loading.present();
    }

    async dismissLoading() {
      await this.loadingCtrl.dismiss().catch();
      this.isLoading = false;
    }

    async presentToast(message: string) {
      let toast = await this.toastCtrl.create({
        message,
        duration: 2000,
        position: 'bottom',
        mode: 'md',
        cssClass: 'toast-class',
        buttons: [
          {
            icon: 'close',
            role:"cancel"
          },
        ],
      });

      await toast.present();
    }

    async alert(obj:any) {
      const alert = await this.alertCtrl.create({
        header:obj.header,
        message:obj.message ,
        mode:"ios",
        cssClass: 'alert_class',
        buttons:[
          {
            text:obj.cancel || 'إلغاء',
            role:"cancel",
          },
          {
            text:obj.confirm || "موافق",
            role:"confirm",
          }
        ]
      })
      await alert.present();
      const data = await alert.onDidDismiss();
      return data?.role == 'confirm'
    }


    async setStatusBar(style: any, color: string, overlay: boolean) {
      if (Capacitor.getPlatform() == 'web') return
      await StatusBar.setStyle({ style })
      if (this.platForm.is('ios')) return
      await StatusBar.setBackgroundColor({ color })
      await StatusBar.setOverlaysWebView({ overlay })
    }

}
