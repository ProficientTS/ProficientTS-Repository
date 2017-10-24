import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, App, Modal, ModalController } from 'ionic-angular';

import { WebserviceProvider } from '../../../providers/webservice/webservice';
import { ProductTabPage } from '../producttab/producttab';  
import { PartDetailPage } from '../partdetail/partdetail';  

import { Global } from '../../../providers/global';
import * as _ from 'underscore';

import { LoginPage } from '../../login/login';
import { ModalPage } from '../../modal/modal';
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
show: any = 'part';
partURL: any = "";
partList: any = [];
info: any;
tit: any;
header: any;
system: any;
fav: boolean;
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
};
location: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider, private g: Global,
  private app: App, private modalCtrl: ModalController) {
    console.log('SetDetailPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.title = this.data["set_nm"];
    this.desc = this.data.desc;
    this.img = this.data.img;
    this.system = this.data.system;
    this.partList = this.data.part;
    if(this.data.part.length){
      this.partURL = this.data.part[0].url;
      console.log("partURL", this.partURL);
    }
    _.each(this.system, function(element, i){
      element["Name"] = element.system_nm;
      element["ID"] = element.system_id;
    });
    _.each(this.data.part, function(element, i){
      element["Name"] = element.part_nm;
      element["ID"] = element.part_id;
    });
    
    this.header = [
                    {
                      f: 1,
                      d_fn: "System",
                      c_fn: "System",
                      val: this.system
                    }
                  ];
    console.log(this.header);
    // g.Network = true;
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.location = _.uniq(_.pluck(this.data.part, 'location'))
    console.log(this.location);
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
    var url = "";
    if(this.data && this.data.img && this.data.img.length){
      url = this.data.img[0].url;
    }
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), ID: this.data.set_id, Name: this.data.set_nm, type: 'set', url: url }, {$set: {time: Number(new Date())}}, function(rst){
      console.log(rst);
    });
  }

  filterByLocation(val: any){
    console.log(val);
    if(val.length){
      this.partList = _.filter(this.data.part, (v) => {
        return v.location == val;
      })
    }
    else{
      this.partList = this.data.part;
    }
  }

  fnDisplay(v: any){
    console.log(v);
    if(v){
      var query = {voidfl : {$ne : 'Y'}};
      query['part_id'] = v;
      this.g.findQ(this.g.db.part, query)
        .then((docs: any) => {
          console.log(docs);
          if(docs.length){
            this.navCtrl.push(PartDetailPage, {
              data: docs,
              type: 'part'
            });
          }
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
        case "part":
          this.navCtrl.push(PartDetailPage, {
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

  showSystem() {
    let system = [];
    _.each(this.data.system, (v) => {
      system.push({Name: v.system_nm, ID: v.system_id})
    })
    let modal: Modal = this.modalCtrl.create(ModalPage, { data: system, title: "Systems Used" });
    modal.onDidDismiss((data: any) => {
      console.log("Modal Reply", data);
      if(data != null){
        this.g.findQSSL(this.g.db.system, { system_id: data.ID, voidfl : {$ne : 'Y'} }, { system_id: 1}, 0, 0)
        .then((docs: any) => {
            console.log(docs);
            if(docs.length){
              this.navCtrl.push(ProductTabPage, {
                data: docs
              });
            }
        })
        .catch((err: any) => {
          console.log(err);
        })
      }
    });
    modal.present();
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
