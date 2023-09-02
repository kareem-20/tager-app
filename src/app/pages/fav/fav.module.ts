import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavPageRoutingModule } from './fav-routing.module';

import { FavPage } from './fav.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule,
    FavPageRoutingModule,
  ],
  declarations: [FavPage],
})
export class FavPageModule {}
