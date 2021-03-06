import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductDetailPage } from '../productdetail/productdetail';
import { ProductDocumentPage } from '../productdocument/productdocument';
import { ProductImagePage } from '../productimage/productimage';
import { ProductVideoPage } from '../productvideo/productvideo';
import { ProductSetPage } from '../productset/productset';
import { ProductPartPage } from '../productpart/productpart';

import { Global } from '../../../providers/global';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global) {
    this.data = navParams.get('data');
    this.type = navParams.get('type');
    if(this.data.length && this.data[0][g.Lang]){
      for(var key in this.data[0][g.Lang]){
        this.data[0][key] = this.data[0][g.Lang][key];
      }
    }
    this.info = {data: this.data, type: this.type}
    console.log(this.data);
    console.log(this.type);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductTabPage');
  }

}
