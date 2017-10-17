import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, App } from 'ionic-angular';

import { Global } from '../../providers/global';

import { CatalogPage } from '../catalog/catalog';
import { SharePage } from '../share/share';

import * as _ from 'underscore';

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
color: string = "#dddddd";
font: string = "black";
timeOut: any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global, private app: App) {
    console.log(this.headerIpt);
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.setShareCount();
  }

  setMsg(code: any){
    /*
      series:
      1 - In Progress
      2 - Success
      3 - General Notification
      4 - Others like validations
      5 - Failure
    */
    let msgArr = _.filter(this.g.validations(), (v) => {
      return v.code == code;
    });
    
    this.msg = msgArr[0]["En"];   // Lang as selected
    console.log(this.msg)
    var series = code.toString()[0];
    console.log(code);
    console.log(series)
    
    switch(parseInt(series)){
      case 1:
        this.color = "yellow";
        this.font = "green";
        clearTimeout(this.timeOut);
      break;
      case 2:
        this.color = "green";
        this.font = "yellow";
        this.setTime();
      break;
      case 3:
        this.color = "blue";
        this.font = "yellow";
        this.setTime();
      break;
      case 4:
        this.color = "orange";
        this.font = "yellow";
        this.setTime();
      break;
      case 5:
        this.color = "red";
        this.font = "yellow";
        this.setTime();
      break;
      default:
        this.resetMsg();
    }
  }

  setTime(){
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
          console.log("Time Out");
          this.resetMsg();
      }, 3000);
  }

  resetMsg(){
    clearTimeout(this.timeOut);
    this.color = "#dddddd";
    this.font = "black";
    this.msg = "";
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
