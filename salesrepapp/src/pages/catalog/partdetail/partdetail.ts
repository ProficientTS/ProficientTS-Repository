import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebserviceProvider } from '../../../providers/webservice/webservice';
import { ProductTabPage } from '../producttab/producttab';
import { SetDetailPage } from '../setdetail/setdetail';

@Component({
  selector: 'page-partdetail',
  templateUrl: 'partdetail.html',
})
export class PartDetailPage {
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
    console.log('PartDetailPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.title = this.data["part_nm"];
    console.log(this.data);
    this.desc = this.data.desc;
    this.img = this.data.img;
    // This One is hardcoded bigtime. Concept shown correctly. Recode soon!
    this.header = [
                    {
                      f: 1,
                      d_fn: "System",
                      c_fn: "System",
                      val: this.data.system
                    },
                    {
                      f: 2,
                      d_fn: "Set",
                      c_fn: "Set",
                      val: this.data.set
                    },
                    {
                      f: 3,
                      d_fn: "Dimension",
                      c_fn: "Dimension",
                      val: [
                        {desc: "20mm x 15mm x 4.5mm Logitudinal Fortion"}
                      ]
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
        case "set":
          this.navCtrl.push(SetDetailPage, {
            data: data.data
          });
          break;
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
    console.log('ionViewDidLoad PartDetailPage');
  }
}
