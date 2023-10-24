import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { DataService } from 'src/app/services/data/data.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  image: any;
  userData: any;
  constructor(
    private dataService: DataService,
    private navCtrl: NavController,
    private cameraService: CameraService,
    private helper: FunctionsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userData = this.authService.userMongoData;
    console.log(this.userData);
  }

  selectImage() {
    console.log('clicked');
    this.cameraService.showActionSheet().then((val) => {
      this.image = val;
    });
  }

  back() {
    this.navCtrl.back();
  }

  async submit() {
    if (this.image) {
      let image = await this.cameraService.uploadOneImage(this.image);

      let body = {
        image,
      };

      this.authService.updateUser(body);
    }
  }
}
