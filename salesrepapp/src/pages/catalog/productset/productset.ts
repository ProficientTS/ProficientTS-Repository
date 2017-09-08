import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-productset',
  templateUrl: 'productset.html',
})
export class ProductSetPage {
data: any;
title: any;
set: any;
info: any;
tit: any;
type: any;
header: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('ProductSetPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data[this.tit];
    this.set = this.data.set;
    this.header = [
                    {
                      f: 1,
                      d_fn: "Set",
                      c_fn: "Set ID",
                      class: "ptsW20pr"
                    },
                    {
                      f: 2,
                      d_fn: "Description",
                      c_fn: "Description",
                      class: "ptsW60pr"
                    },
                    {
                      f: 3,
                      d_fn: "Qty",
                      c_fn: "In stock",
                      class: "ptsW10pr ptsTextCenter"
                    },
                    {
                      f: 4,
                      d_fn: "Action",
                      c_fn: "Action",
                      class: "ptsW8pr ptsTextCenter"
                    }
                  ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductSetPage');
  }

}

