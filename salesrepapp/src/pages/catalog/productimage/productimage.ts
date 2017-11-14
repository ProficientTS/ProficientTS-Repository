import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Modal, ModalController } from 'ionic-angular';

import { Global } from '../../../providers/global';

import * as _ from 'underscore';

import { HeaderComponent } from '../../header/header.component';
import { ImgCntrlPage } from '../../imgCntrl/imgCntrl';

@Component({
  selector: 'page-productimage',
  templateUrl: 'productimage.html',
})
export class ProductImagePage implements OnInit {
  @ViewChild(HeaderComponent) hc: HeaderComponent
data: any;
title: any;
img: any;
info: any;
tit: any;
type: any;
imgType = [];
typeJsn: any = {};
fav: boolean;
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
}
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global, private modalCtrl: ModalController
  ) {
    console.log('ProductImagePage IN----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data.system_nm;
    this.img = this.data.img;
    if(this.img.length){
      this.imgType = _.uniq(_.pluck(this.img, 'type'));
      console.log(this.imgType);
      for(var i = 0; i < this.imgType.length; i++){
        this.typeJsn[this.imgType[i]] = _.filter(this.img, (v) => {
          return v.type == this.imgType[i];
        });
      }
    }
    console.log(this.typeJsn);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductImagePage');
    this.hc.backButtonClickEventSetUp();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ProductImagePage');
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

    this.g.findQ(this.g.db.fav, {accountID: localStorage.getItem('email'), type: 'img', fav: true})
    .then((favs: any) => {
      console.log(favs);
      for(var int = 0; int < favs.length; int++){
        for(var j = 0; j < this.img.length; j++){
          if(this.img[j].title == favs[int].title && this.img[j].url == favs[int].url){
            this.img[j].fav = true;
          }
        }
      }
    })
    .catch((err)=> console.log(err));

    this.g.findQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: 'img', share: true})
      .then((imgs: any) => {
        for(var i = 0; i < imgs.length; i++){
          for(var j = 0; j < that.img.length; j++){
            if(that.img[j].title == imgs[i].title && that.img[j].url == imgs[i].url){
              that.img[j].share = true;
            }
          }
        }
      })
      .catch((err: any) => {

      });
  }

  // viewImg(url: string){
  //   console.log(url);
  //   let path: any = url.split('/');
  //   path.pop();
  //   path = path.join('/');
  //   let filenm = url.split('/')[(url.split('/').length - 1)]
  //   console.log(path);
  //   console.log(filenm);
  //   this.g.file.readAsDataURL(this.g.file.dataDirectory + 'ProficientTS Test Folder/' + path, filenm)
  //   .then((dataURL:string) => { 
  //     // console.log(dataURL);
  //     this.g.photoViewer.show(dataURL)
  //   })
  //   .catch((err: any) => {
  //     console.log(err);
  //     this.g.iab.create(this.g.server + url);
  //   })
  // }

  openImg(item: any){
    console.log(item)
    console.log(this.img)
    let modal: Modal = this.modalCtrl.create(ImgCntrlPage, { data: this.img, item: item });
    modal.onDidDismiss((data: any) => {
      console.log("Modal Reply", data);
    });
    modal.present();
    // this.g.iab.create(this.g.Network===true ? this.g.server + item.url : this.g.file.dataDirectory + 'ProficientTS Test Folder/' + item.url);
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), title: item.title, type: 'img', url: item.url }, {$set: {time: Number(new Date())}}, function(rst){
      console.log(rst);
    });
  }

  shareImg(item: any){
    console.log(item);
    var that = this;

    let share = (item.share === undefined) ? true : !item.share;
    this.g.upsertQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: 'img', url: item.url, title: item.title }, {$set: {share: share}}, function(rst){
      console.log(rst);
      if(rst){
        _.each(that.img, (v, i) => {
          if(v.title == item.title && v.url == item.url){
            v.share = share;
          }
        })
        that.headerIpt.shareCnt = (share) ? ++that.headerIpt.shareCnt : --that.headerIpt.shareCnt;
      }
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
