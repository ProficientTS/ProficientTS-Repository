import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Global } from '../../../providers/global';

import * as _ from 'underscore';

import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'page-productdocument',
  templateUrl: 'productdocument.html',
})
export class ProductDocumentPage implements OnInit {
  @ViewChild(HeaderComponent) hc: HeaderComponent
data: any;
title: any;
doc: any;
info: any;
tit: any;
type: any;
docType = [];
fav: boolean;
typeJsn: any = {};
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
}

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global) {
    console.log('ProductDocumentPage ----------------------')
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data.system_nm;
    this.doc = this.data.doc;
    if(this.doc.length){
      this.docType = _.uniq(_.pluck(this.doc, 'type'));
      console.log(this.docType);
      for(var i = 0; i < this.docType.length; i++){
        this.typeJsn[this.docType[i]] = _.filter(this.doc, (v) => {
          return v.type == this.docType[i];
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

    this.g.findQ(this.g.db.fav, {accountID: localStorage.getItem('email'), type: 'doc', fav: true})
    .then((favs: any) => {
      console.log(favs);
      for(var int = 0; int < favs.length; int++){
        for(var j = 0; j < this.doc.length; j++){
          if(this.doc[j].title == favs[int].title && this.doc[j].url == favs[int].url){
            this.doc[j].fav = true;
          }
        }
      }
    })
    .catch((err)=> console.log(err));

    this.g.findQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: 'doc', share: true})
      .then((docs: any) => {
        for(var i = 0; i < docs.length; i++){
          for(var j = 0; j < that.doc.length; j++){
            if(that.doc[j].title == docs[i].title && that.doc[j].url == docs[i].url){
              that.doc[j].share = true;
            }
          }
        }
      })
      .catch((err: any) => {

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDocumentPage');
    this.hc.backButtonClickEventSetUp();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ProductDetailPage');
  }

  viewDoc(item : any){
    console.log(item);
    // this.g.document.viewDocument(this.g.file.dataDirectory + 'ProficientTS Test Folder/' + url, 'application/pdf', this.g.docVOptions, undefined, undefined, undefined, (err) => {
    //   console.log(err);
      
    // })
    this.g.iab.create(this.g.Network===true ? this.g.server + item.url : this.g.file.dataDirectory + 'ProficientTS Test Folder/' + item.url);
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), title: item.title, type: 'doc', url: item.url }, {$set: {time: Number(new Date())}}, function(rst){
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

  shareDoc(item: any, index: any){
    console.log(item);
    var that = this;

    let share = (item.share === undefined) ? true : !item.share;
    console.log(index);
    this.g.upsertQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: 'doc', url: item.url, title: item.title }, {$set: {share: share}}, function(rst){
      console.log(rst);
      if(rst){
        _.each(that.doc, (v, i) => {
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

