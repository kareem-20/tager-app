// import  } from './../helpers/helpers.service';
import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as htmlToImage from 'html-to-image';
import { Share } from '@capacitor/share';

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { FunctionsService } from '../functions/functions.service';

const INVITATION_DIR = 'stored-Invitation';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(
    private helper: FunctionsService,
    private sharing: SocialSharing
  ) {}

  async createFolder() {
    Filesystem.readdir({
      path: INVITATION_DIR,
      directory: Directory.Data,
    }).then(
      async (result) => {
        // Folder  exists!
      },
      async (err) => {
        // Folder does not exists!
        await Filesystem.mkdir({
          path: INVITATION_DIR,
          directory: Directory.Data,
        });
      }
    );
  }

  // generate image from html
  async generateImage(node) {
    return await htmlToImage.toPng(node).catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
  }

  async writeFile(database64, name) {
    const file = await Filesystem.writeFile({
      path: `${INVITATION_DIR}/${name}_${new Date().getTime()}.png`,
      data: database64,
      directory: Directory.Data,
    });

    return file;
  }

  async shareInvitation(uri: any) {
    this.helper.dismissLoading();
    this.sharing.share('image', 'image', uri).catch((err) => {
      console.log(err);
    });
    // await Share.share({
    //   title: 'this your invitaion',
    //   url: uri,
    // }).catch(err => {
    //   console.log(err);
    // })
  }

  async sendInvitaion(node) {
    // await this.createFolder();
    let image = await this.generateImage(node);
    // let file = await this.writeFile(image, name)
    await this.shareInvitation(image);
    // await this.convertBaseToImage(image)
  }
}
