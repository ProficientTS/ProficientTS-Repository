import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebserviceProvider } from '../../../providers/webservice/webservice';
import { ProductTabPage } from '../producttab/producttab';

@Component({
  selector: 'page-productpart',
  templateUrl: 'productpart.html',
})
export class ProductPartPage {
data: any;
title: any;
part: any;
info: any;
tit: any;
type: any;
header: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider) {
    console.log('ProductPartPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data[this.tit];
    this.part = this.data.part;
    this.header = [
                    {
                      f: 1,
                      d_fn: "Part",
                      c_fn: "Part ID",
                      class: "ptsW80pr"
                    },
                    {
                      f: 2,
                      d_fn: "Action",
                      c_fn: "Action",
                      class: "ptsW8pr ptsTextCenter"
                    }
                    
                  ]
  }

  partDetail(v: any) {
    console.log(v);
    this.ws.postCall('display/part/'+ v, {})
    .then(data => {
      this.handleData(data);
    });
  }

  handleData(data: any){
    if(data.success){
      this.navCtrl.push(ProductTabPage, {
        data: data.data,
        type: "part"
      });
    }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPartPage');
  }

}

