import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';

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
}
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private document: DocumentViewer,
  private file: File) {
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

}

