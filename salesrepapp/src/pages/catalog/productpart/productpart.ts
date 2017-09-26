import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebserviceProvider } from '../../../providers/webservice/webservice';
import { PartDetailPage } from '../partdetail/partdetail';

import { Global } from '../../../providers/global';

import * as _ from 'underscore';

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
fnl = [];
prt = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider, private g: Global) {
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
                      val: "part_id"
                    },
                    {
                      f: 2,
                      d_fn: "Action",
                      c_fn: "Action",
                      val: "View"
                    }
                    
                  ];
    let hdr = this.header;
    let len = hdr.length;

    // Dynamic header and data
    var that = this;
    _.each(this.part, function(element, i){
      for(let i = 0; i < len; i++){
        //if view option is required
        that.prt[hdr[i].val] = (hdr[i].val == "View") ? "View" : element[hdr[i].val];
      }
      that.fnl.push(that.prt);
    });
    console.log(this.fnl);
  }

  partDetail(v: any) {
    console.log(v);
    if(v == "View"){
      if(this.g.Network){
        this.ws.postCall('display/part/'+ v, {})
        .then(data => {
          this.handleData(data);
        });
      }
      else{
        var that = this;
        this.g.findQ(this.g.db.part, {voidfl : {$ne : 'Y'}})
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
      this.navCtrl.push(PartDetailPage, {
        data: data.data
      });
    }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPartPage');
  }

}

