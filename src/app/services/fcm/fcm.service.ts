import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FCM } from '@capacitor-community/fcm';
import {
  ActionPerformed,
  PushNotifications,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Howl } from 'howler';
import { ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class FcmService {
  user: any = {};
  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private storage: Storage,
    private router: Router,
    private http: HttpClient
  ) {}

  async initPush() {
    this.user = await this.storage.get('user-mongo');
    if (Capacitor.getPlatform() == 'web') return;
    await PushNotifications.requestPermissions();
    await PushNotifications.register();
    this.notificationsAll();
    // this.notificationsOne()
  }

  async notificationsAll() {
    await FCM.subscribeTo({ topic: `all` });
    // if (this.user.phone) await FCM.subscribeTo({ topic: `user-${this.user.phone}` })

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: any) => {
        this.presentToast(notification.title, notification.body);
      }
    );
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (noti) => {
        this.navCtrl.navigateForward('/notification');
      }
    );
  }

  async notificationsOne() {
    if (Capacitor.getPlatform() == 'web') return;
    if (this.user.username) {
      await FCM.subscribeTo({ topic: `user-${this.user.username}` });
    }
  }
  // async getToken() {
  //   if (Capacitor.getPlatform() == 'web') return null
  //   const token = await FCM.getToken()
  //   return token.token
  // }

  async unsubscribeAll() {
    if (Capacitor.getPlatform() == 'web') return;
    await FCM.unsubscribeFrom({ topic: `all` });
  }
  async unsubscribeOne() {
    if (Capacitor.getPlatform() == 'web') return;
    if (this.user.username)
      await FCM.unsubscribeFrom({ topic: `user-${this.user.username}` });
  }
  // Toast For Notification
  async presentToast(header: string, message: string) {
    const toast = await this.toastCtrl.create({
      header,
      message,
      position: 'top',
      duration: 3000,
    });
    this.sound();
    await toast.present();
    toast.addEventListener('click', async () => {
      this.navCtrl.navigateForward('/pages/tabs/notification');
      await toast.dismiss();
    });
  }

  // NotificationSound
  sound() {
    const sound = new Howl({
      src: ['../../../assets/fcm_ringtones.mp3'],
      volume: 1,
    });

    sound.play();
  }

  // postNotification(body: any) {
  //   this.http.post(`http://209.250.237.58:5006/fcm`, body).pipe(take(1)).subscribe()
  // }
}
