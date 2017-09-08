import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebserviceProvider } from '../../../providers/webservice/webservice';
import { ProductTabPage } from '../producttab/producttab';  

@Component({
  selector: 'page-setdetail',
  templateUrl: 'setdetail.html',
})
export class SetDetailPage {
data: any;
title: any;
img: any;
desc: any;
type: any;
info: any;
tit: any;
header: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider) {
    console.log('SetDetailPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.title = this.data["set_nm"];
    this.desc = this.data.desc;
    this.img = this.data.img;
    this.header = [
                    {
                      f: 1,
                      d_fn: "System",
                      c_fn: "System",
                      val: this.data.system
                    }
                  ];
  }

  fnDisplay(t: any, v: any){
    console.log(t);
    console.log(v);
    t = t.toLowerCase();
    if(v !==undefined){
      this.ws.postCall('display/'+t+'/'+ v, {})
      .then(data => {
        this.handleData(t, data);
      });
    }
  }

  handleData(t: any, data: any){
      console.log(this.type)
    if(data.success){
      switch(t){
        case "system":
          this.navCtrl.push(ProductTabPage, {
            data: data.data,
            type: t
          });
          break;
      }
    }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetDetailPage');
  }
}
