import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';

import { WebserviceProvider } from '../../../providers/webservice/webservice';
import { SetDetailPage } from '../setdetail/setdetail';
import { LoginPage } from '../../login/login';

import { Global } from '../../../providers/global';

import * as _ from 'underscore';

import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'page-productset',
  templateUrl: 'productset.html',
})
export class ProductSetPage implements OnInit {
  @ViewChild(HeaderComponent) hc: HeaderComponent
data: any;
title: any;
set: any;
info: any;
tit: any;
type: any;
header: any;
fnl = [];
fav: boolean;
st = {};
txt = "";
srh: any = [];
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
}
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider, private g: Global,
  private app: App) {
    console.log('ProductSetPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data.system_nm;
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
    this.srh = this.fnl;
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    var that = this;
    this.g.findQ(this.g.db.fav, {accountID: localStorage.getItem('email'), ID: this.data.system_id, type: 'system', fav: true})
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
  }

  searchItem(){
    if(this.txt.length > 2){
      // let searchArray = [];
      let searchKeys = ["set_id", "desc", "qty"]; 
      this.srh = _.filter(this.fnl, (v, i) => {
        let searchTxt = "";
        for(var key in v){
          if(_.contains(searchKeys, key)){
            searchTxt = searchTxt + " " + v[key].toString().toLowerCase();
          }
        }
        let exp = this.txt.toLowerCase();
        return searchTxt.indexOf(exp) !=-1;
      });
      console.log(this.fnl);
    }
    else{
      this.srh = this.fnl;
    }
  }

  setDetail(h: any, v: any) {
    console.log(h);
    console.log(v);
    if(h == "Action" || h == "Set ID"){
      this.g.findQ(this.g.db.set, {set_id: v, voidfl : {$ne : 'Y'}})
      .then((docs: any) => {
          console.log(docs);
          this.handleData({data: docs, success: true})
          
        }) // here you will get it
        .catch((err) => console.error(err));
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
    this.hc.backButtonClickEventSetUp();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ProductSetPage');
  }

  logOut(){
    console.log("logOut ========")
    localStorage.removeItem('token');
    this.app.getRootNav().setRoot(LoginPage);
  }

  fnFav(fav: boolean){
    var that = this;
    console.log(this.data)
    var url = "";
    if(this.data && this.data.img && this.data.img.length){
      url = this.data.img[0].url;
    }
    this.g.upsertQ(this.g.db.fav, {accountID: localStorage.getItem('email'), ID: this.data.system_id, Name: this.data.system_nm, type: 'system', url: url }, {$set: { fav : fav}}, function(rst){
      console.log(rst);
      if(rst){
        that.fav = !that.fav;
        that.hc.setMsg((that.fav) ? 20000003 : 20000004);
      }
    })
  }

}

