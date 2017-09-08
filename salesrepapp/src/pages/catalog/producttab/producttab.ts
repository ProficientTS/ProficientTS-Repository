import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductDetailPage } from '../productdetail/productdetail';
import { ProductDocumentPage } from '../productdocument/productdocument';
import { ProductImagePage } from '../productimage/productimage';
import { ProductVideoPage } from '../productvideo/productvideo';
import { ProductSetPage } from '../productset/productset';
import { ProductPartPage } from '../productpart/productpart';

@Component({
  selector: 'page-producttab',
  templateUrl: 'producttab.html',
})
export class ProductTabPage {
ProductDetailPage = ProductDetailPage;
ProductDocumentPage = ProductDocumentPage;
ProductImagePage = ProductImagePage;
ProductVideoPage = ProductVideoPage;
ProductSetPage = ProductSetPage;
ProductPartPage = ProductPartPage;
data: any;
type: any;
info: any;
// detail: any;
// doc: any;
// img: any;
// vid: any;
// set: any;
// part: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = navParams.get('data');
    this.type = navParams.get('type');
    // this.detail = this.data[0];
    // this.doc = this.data[0].doc;
    // this.img = this.data[0].img;
    // this.vid = this.data[0].video;
    // this.set = this.data[0].set;
    // this.part = this.data[0].part;
    this.info = {data: this.data, type: this.type}
    console.log(this.data);
    console.log(this.type);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductTabPage');
  }

}
