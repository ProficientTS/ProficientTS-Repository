import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'underscore';
import { Global } from '../../../providers/global';

import { CatalogPage } from '../catalog';

import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'page-productdetail',
  templateUrl: 'productdetail.html',
})
export class ProductDetailPage implements OnInit {
  @ViewChild(HeaderComponent) hc: HeaderComponent
data: any;
title: any;
img: any;
desc: any;
type: any;
info: any;
fav: boolean;
time: any;
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
}
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global
  ) {
    console.log('ProductDetailPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    // this.title = this.data["system_nm"];
    this.title = this.data.system_nm;
    this.desc = this.data.desc;
    this.img = this.data.img;
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
    this.time = Number(new Date());
    var url = "";
    if(this.data && this.data.img && this.data.img.length){
      url = this.data.img[0].url;
    }
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), ID: this.data.system_id, Name: this.data.system_nm, type: 'system', url: url }, {$set: {time: this.time}}, function(rst){
      console.log(rst);
    });
    
  }

  listTechniqueSys(technm: any){
    this.navCtrl.push(CatalogPage, {
      header: {
        type: 'techsys',
        hdrData: technm
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
    this.hc.backButtonClickEventSetUp();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ProductDetailPage');
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
