import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Global } from '../../providers/global';
import { WebserviceProvider } from '../../providers/webservice/webservice';

import { CatalogPage } from '../catalog/catalog';
import { SharePage } from '../share/share';

@Component({
  selector: 'pts-header',
  templateUrl: 'header.html',
})
export class HeaderComponent implements OnInit {
@Input() headerIpt = {
  catalogfacility: false,
  shareCnt: 0
};
catalogfacility: false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider,
  private g: Global) {
    console.log(this.headerIpt);
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.headerIpt);
    var that = this;
    this.g.findQ(this.g.db.share, {accountID: localStorage.getItem('email'), share: true})
    .then((rst: any) => {
      console.log(rst);
      this.headerIpt.shareCnt = rst.length;
    })
    .catch((err: any) => {

    });
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter LoginPage');
  }

  ionViewCanEnter(){
    console.log('ionViewCanEnter LoginPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter LoginPage');
  }

  goToCatalog(val: any){
    this.navCtrl.push(CatalogPage, {
      header: {
        type: val
      }
    });
  }

  openSharePage(){
    this.navCtrl.push(SharePage);
  }
}
