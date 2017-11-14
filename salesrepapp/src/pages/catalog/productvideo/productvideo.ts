import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Global } from '../../../providers/global';

import * as _ from 'underscore';

import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'page-productvideo',
  templateUrl: 'productvideo.html',
})
export class ProductVideoPage {
  @ViewChild(HeaderComponent) hc: HeaderComponent
data: any;
title: any;
video: any;
type: any;
info: any;
tit: any;
videoType = [];
typeJsn: any = {};
fav: boolean;
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
}
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global) {
    console.log('ProductVideoPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data.system_nm;
    this.video = this.data.video;
    if(this.video.length){
      this.videoType = _.uniq(_.pluck(this.video, 'type'));
      console.log(this.videoType);
      for(var i = 0; i < this.videoType.length; i++){
        this.typeJsn[this.videoType[i]] = _.filter(this.video, (v) => {
          return v.type == this.videoType[i];
        });
      }
    }
    console.log(this.typeJsn);
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

    this.g.findQ(this.g.db.fav, {accountID: localStorage.getItem('email'), type: 'vid', fav: true})
    .then((favs: any) => {
      console.log(favs);
      for(var int = 0; int < favs.length; int++){
        for(var j = 0; j < this.video.length; j++){
          if(this.video[j].title == favs[int].title && this.video[j].url == favs[int].url){
            this.video[j].fav = true;
          }
        }
      }
    })
    .catch((err)=> console.log(err));

    this.g.findQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: 'vid', share: true})
      .then((vids: any) => {
        for(var i = 0; i < vids.length; i++){
          for(var j = 0; j < that.video.length; j++){
            if(that.video[j].title == vids[i].title && that.video[j].url == vids[i].url){
              that.video[j].share = true;
            }
          }
        }
      })
      .catch((err: any) => {

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductVideoPage');
    this.hc.backButtonClickEventSetUp();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ProductVideoPage');
  }

  viewVideo(item: any){
    this.g.iab.create(this.g.Network===true ? this.g.server + item.url : this.g.file.dataDirectory + 'ProficientTS Test Folder/' + item.url);
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), title: item.title, type: 'vid', url: item.url }, {$set: {time: Number(new Date())}}, function(rst){
      console.log(rst);
    });
  }

  setFavorite(type: string, item: any, index: number, key: string){
    var that = this, query = {};

    if(type == 'system'){
      var url = "";
      if(this.data && this.data.img && this.data.img.length){
        url = this.data.img[0].url;
      }
      query = {accountID: localStorage.getItem('email'), ID: this.data[type + '_id'], Name: this.data[type + '_nm'], type: type, url: url}
    }
    else{
      query = {accountID: localStorage.getItem('email'), title: item.title, type: type, url: item.url }
    }
    console.log(query);
    if(item.fav === undefined){
      item.fav = false;
    }
    this.g.upsertQ(this.g.db.fav, query, {$set: { fav : !item.fav}}, (rst) => {
      console.log(rst);
      if(rst){
        item.fav = !item.fav;
        if(index){
          this.typeJsn[key][index].fav = item.fav;
        }else{
          that.fav = item.fav;
        }
        this.hc.setMsg((item.fav) ? 20000003 : 20000004);
      }
    })
  }

  shareVid(item: any, index: any){
    console.log(item);
    var that = this;

    let share = (item.share === undefined) ? true : !item.share;
    console.log(index);
    this.g.upsertQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: 'vid', url: item.url, title: item.title }, {$set: {share: share}}, function(rst){
      console.log(rst);
      if(rst){
        _.each(that.video, (v, i) => {
          if(v.title == item.title && v.url == item.url){
            v.share = share;
          }
        })
        that.headerIpt.shareCnt = (share) ? ++that.headerIpt.shareCnt : --that.headerIpt.shareCnt;
      }
    });
  }

  // fnFav(fav: boolean){
  //   var that = this;
  //   console.log(this.data)
  //   var url = "";
  //   if(this.data && this.data.img && this.data.img.length){
  //     url = this.data.img[0].url;
  //   }
  //   this.g.upsertQ(this.g.db.fav, {accountID: localStorage.getItem('email'), ID: this.data.system_id, Name: this.data.system_nm, type: 'system', url: url }, {$set: { fav : fav}}, function(rst){
  //     console.log(rst);
  //     if(rst){
  //       that.fav = !that.fav;
  //       that.hc.setMsg((that.fav) ? 20000003 : 20000004);
  //     }
  //   })
  // }

}
