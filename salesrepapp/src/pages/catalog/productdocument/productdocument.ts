import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

@Component({
  selector: 'page-productdocument',
  templateUrl: 'productdocument.html',
})
export class ProductDocumentPage {
data: any;
title: any;
doc: any;
info: any;
tit: any;
type: any;
options: DocumentViewerOptions = {
  title: 'Proficient Documents'
};

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private document: DocumentViewer,
  private file: File,
  private mail: EmailComposer) {
    console.log('ProductDocumentPage ----------------------')
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data[this.tit];
    this.doc = this.data.doc;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDocumentPage');
  }

  viewDoc(url : string){
    console.log(url);
    this.document.viewDocument(this.file.applicationDirectory  + 'www/'+ url, 'application/octet-stream', this.options)
  }

  shareDoc(url: string){
    console.log(url);
    var that = this;
    // this.mail.isAvailable().then((available: boolean) =>{
    //   console.log("Email ---- " + available);
    //   if(available) {
        //Now we know we can send
        that.mail.open({
        to: 'cjchrist777@gmail.com',
        cc: 'christson_johnny@yahoo.com',
        bcc: [],
        attachments: [
          this.file.applicationDirectory  + 'www/'+ url
        ],
        subject: 'Cordova Icons by {P}',
        body: 'How are you? Nice greetings from {P}'
        // ,
        // isHtml: true
      });
    //   }
    // });
  }

}

