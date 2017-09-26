import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Global } from '../../../providers/global';

@Component({
  selector: 'page-productdetail',
  templateUrl: 'productdetail.html',
})
export class ProductDetailPage implements OnInit {
data: any;
title: any;
img: any;
desc: any;
type: any;
info: any;
tit: any;
fav: boolean;
time: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global
  ) {
    console.log('ProductDetailPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    // this.title = this.data["system_nm"];
    this.tit = "system_nm";
    this.title = this.data[this.tit];
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
    // this.time =
    //     this.time.getDay() + "/" +
    //     this.time.getMonth() + "/" +
    //     this.time.getFullYear() + "  " +
    //     this.time.getHours() + ":" +
    //     this.time.getMinutes() + ":" +
    //     this.time.getMilliseconds();
    // this.time = this.time.getFullYear() + this.time.getMonth() + this.time.getDay()
    //           + this.time.getHours() + this.time.getMinutes() + this.time.getMilliseconds();
    this.g.setRecent({accountID: localStorage.getItem('email'), ID: this.data.system_id, Name: this.data.system_nm, type: 'system'}, {$set: {time: this.time}}, function(rst){
      console.log(rst);
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
  }

  fnFav(fav: boolean){
    var that = this;
    this.g.setFavorite({accountID: localStorage.getItem('email'), ID: this.data.system_id, Name: this.data.system_nm, type: 'system'}, {$set: { fav : fav}}, function(rst){
      console.log(rst);
      if(rst){
        that.fav = !that.fav;
      }
    })
  }

}
