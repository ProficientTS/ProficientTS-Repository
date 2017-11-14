import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Global } from '../../providers/global';
import * as _ from 'underscore';

@Component({
  selector: 'page-imgCntrl',
  templateUrl: 'imgCntrl.html'
})
export class ImgCntrlPage {
  img: any = [];
  item: any = {
    title: "",
    url: "",
    type: ""
  };
  constructor(private navParams: NavParams, private viewCtrl: ViewController, private g: Global) {
    console.log('Data', navParams.get('data'));
    this.img = navParams.get('data');
    this.item = navParams.get('item');
  }

  closeModal(){
    this.viewCtrl.dismiss(null);
  }

  selectedItem(item: any){
    console.log(item)
    this.item = item;
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), title: item.title, type: 'img', url: item.url }, {$set: {time: Number(new Date())}}, function(rst){
      console.log(rst);
    });
  }
}
