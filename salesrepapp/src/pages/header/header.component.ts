import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, App } from 'ionic-angular';

import { Global } from '../../providers/global';

import { CatalogPage } from '../catalog/catalog';
import { SharePage } from '../share/share';

@Component({
  selector: 'pts-header',
  templateUrl: 'header.html',
})
export class HeaderComponent implements OnInit {
  @ViewChild(Navbar) navbar: Navbar
  @Input() headerIpt: any = {
    catalogfacility: false,
    shareCnt: undefined
  };
msg = "";
back: boolean = false;
playvideo = false;
videosrc = "";
catalogfacility: false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global, private app: App) {
    console.log(this.headerIpt);
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.setShareCount();
    
  }

  setShareCount(){
    console.log(this.headerIpt);
    var that = this;
    console.log(this.headerIpt.shareCnt);
    if(this.headerIpt.shareCnt !== undefined){
      this.g.findQ(this.g.db.share, {accountID: localStorage.getItem('email'), share: true})
      .then((rst: any) => {
        console.log(rst);
        this.headerIpt.shareCnt = rst.length;
      })
      .catch((err: any) => {

      });
    }
  }

  backButtonClickEventSetUp(){
    console.log(this.navbar);
    this.back = true;
    this.navbar.backButtonClick = (e: UIEvent) => {
      console.log("Back button clicked");
      this.navCtrl.parent.viewCtrl.dismiss();
    };
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
    this.app.getRootNav().setRoot(SharePage);
  }
  
  closeVid(){
    this.videosrc = "";
    this.playvideo = false;
  }
}
