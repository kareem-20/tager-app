import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.page.html',
  styleUrls: ['./confirm-delete.page.scss'],
})
export class ConfirmDeletePage implements OnInit {

  @Input() item: any

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.item)
  }

  async dismiss(value: boolean) {
    await this.modalCtrl.dismiss(value)
  }


}
