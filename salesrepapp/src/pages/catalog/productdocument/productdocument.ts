import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

import { Global } from '../../../providers/global';

import * as _ from 'underscore';

@Component({
  selector: 'page-productdocument',
  templateUrl: 'productdocument.html',
})
export class ProductDocumentPage implements OnInit {
data: any;
title: any;
doc: any;
info: any;
tit: any;
type: any;
docType = [];
typeJsn: any = {};
options: DocumentViewerOptions = {
  title: 'Proficient Documents'
};
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
}

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private document: DocumentViewer,
  private file: File,
  private mail: EmailComposer,
  private g: Global) {
    console.log('ProductDocumentPage ----------------------')
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data[this.tit];
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
  }

  viewDoc(url : string){
    console.log(url);
    this.document.viewDocument(this.file.applicationDirectory  + 'www/'+ url, 'application/pdf', this.options)
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

}

