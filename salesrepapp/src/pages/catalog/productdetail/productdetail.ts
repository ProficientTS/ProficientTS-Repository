import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-productdetail',
  templateUrl: 'productdetail.html',
})
export class ProductDetailPage {
data: any;
title: any;
img: any;
desc: any;
type: any;
info: any;
tit: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  ) {
    console.log('ProductDetailPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    // this.title = this.data["system_nm"];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data[this.tit];
    this.desc = this.data.desc;
    this.img = this.data.img;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
  }
}
