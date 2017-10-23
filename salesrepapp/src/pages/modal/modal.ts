import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Global } from '../../providers/global';
import * as _ from 'underscore';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html'
})
export class ModalPage {
  data: any = [];
  title: string = "";
  item: any = null;
  currentSelected: any;
  constructor(private navParams: NavParams, private viewCtrl: ViewController, private g: Global) {
    console.log('Data', navParams.get('data'));
    this.data = navParams.get('data');
    this.title = navParams.get('title');
  }

  closeModal(flag: any){
    this.viewCtrl.dismiss((flag) ? this.item : null);
  }

  selectedItem(item: any, idx: number){
    console.log(item)
    console.log(idx)
    this.currentSelected = idx;
    this.item = item;
  }
}
