import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebserviceProvider } from '../../../providers/webservice/webservice';
import { SetDetailPage } from '../setdetail/setdetail';

import { Global } from '../../../providers/global';

import * as _ from 'underscore';

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
fnl = [];
st = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider, private g: Global) {
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
                      val: "set_id"
                    },
                    {
                      f: 2,
                      d_fn: "Description",
                      c_fn: "Description",
                      val: "desc"
                    },
                    {
                      f: 3,
                      d_fn: "Qty",
                      c_fn: "In stock",
                      val: "qty"
                    },
                    {
                      f: 4,
                      d_fn: "Action",
                      c_fn: "Action",
                      val: "View"
                    }
                  ];
    let hdr = this.header;
    let len = hdr.length;

    // Dynamic header and data
    var that = this;
    _.each(this.set, function(element, i){
      for(let i = 0; i < len; i++){
        //if view option is required
        element[hdr[i].val] = (hdr[i].val == "View") ? "View" : element[hdr[i].val];
      }
      that.fnl.push(element);
    });
    console.log(this.fnl);

  }

  setDetail(h: any, v: any) {
    console.log(h);
    console.log(v);
    if(h == "View"){
      if(this.g.Network){
        this.ws.postCall('display/set/'+ v, {})
        .then(data => {
          this.handleData(data);
        });
      }
      else{
        var that = this;
        this.g.findQ(this.g.db.set, {set_id: v, voidfl : {$ne : 'Y'}})
          .then((docs: any) => {
              console.log(docs);
              that.handleData({data: docs, success: true})
              
            }) // here you will get it
            .catch((err) => console.error(err));
      }
    }
  }

  handleData(data: any){
    if(data.success){
      this.navCtrl.push(SetDetailPage, {
        data: data.data
      });
    }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductSetPage');
  }

}

