import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';

import { WebserviceProvider } from '../../../providers/webservice/webservice';
import { ProductTabPage } from '../producttab/producttab';  

import { Global } from '../../../providers/global';
import * as _ from 'underscore';

import { LoginPage } from '../../login/login';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'page-setdetail',
  templateUrl: 'setdetail.html',
})
export class SetDetailPage implements OnInit {
  @ViewChild(HeaderComponent) hc: HeaderComponent
data: any;
title: any;
img: any;
desc: any;
type: any;
info: any;
tit: any;
header: any;
system: any;
fav: boolean;
time: any;
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
}
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider, private g: Global,
  private app: App) {
    console.log('SetDetailPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.title = this.data["set_nm"];
    this.desc = this.data.desc;
    this.img = this.data.img;
    this.system = this.data.system;
    _.each(this.system, function(element, i){
      element["Name"] = element.system_nm;
      element["ID"] = element.system_id;
    });
    this.header = [
                    {
                      f: 1,
                      d_fn: "System",
                      c_fn: "System",
                      val: this.system
                    },
                    {
                      f: 2,
                      d_fn: "Tray 1",
                      c_fn: "Tray 1",
                      val: this.system
                    },
                    {
                      f: 3,
                      d_fn: "Tray 2",
                      c_fn: "Tray 2",
                      val: this.system
                    },
                    {
                      f: 4,
                      d_fn: "Tray 3",
                      c_fn: "Tray 3",
                      val: this.system
                    }
                  ];
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    var that = this;
    this.g.findQ(this.g.db.fav, {accountID: localStorage.getItem('email'), ID: this.data.set_id, type: 'set', fav: true})
    .then((docs: any) => {
      console.log(docs);
      if(docs.length){
        that.fav = true;
      }
      else{
        that.fav = false;
      }
    })
    .catch((err)=> console.log(err));
    this.time = Number(new Date());
    var url = "";
    if(this.data && this.data.img && this.data.img.length){
      url = this.data.img[0].url;
    }
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), ID: this.data.set_id, Name: this.data.set_nm, type: 'set', url: url }, {$set: {time: this.time}}, function(rst){
      console.log(rst);
    });
  }

  fnDisplay(t: any, v: any){
    console.log(t);
    console.log(v);
    t = t.toLowerCase();
    if(v){
      var query = {voidfl : {$ne : 'Y'}};
      query[t + '_id'] = v;
      this.g.findQ(this.g.db[t], query)
        .then((docs: any) => {
          console.log(docs);
          this.handleData(t, {data: docs, success: true});
        }) // here you will get it
        .catch((err) => console.error(err));
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

  ionViewDidEnter() {
    console.log('ionViewDidEnter SetDetailPage');
  }

  fnFav(fav: boolean){
    var that = this;
    var url = "";
    if(this.data && this.data.img && this.data.img.length){
      url = this.data.img[0].url;
    }
    this.g.upsertQ(this.g.db.fav, {accountID: localStorage.getItem('email'), ID: this.data.set_id, Name: this.data.set_nm, type: 'set', url: url }, {$set: { fav : fav}}, function(rst){
      console.log(rst);
      if(rst){
        that.fav = !that.fav;
        that.hc.setMsg((that.fav) ? 20000003 : 20000004);
      }
    })
  }

  logOut(){
    console.log("logOut ========")
    localStorage.clear();
    this.app.getRootNav().setRoot(LoginPage);
  }
}
