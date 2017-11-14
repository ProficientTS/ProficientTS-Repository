import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, Navbar, App } from 'ionic-angular';

import { Global } from '../../providers/global';

import { CatalogPage } from '../catalog/catalog';
import { SharePage } from '../share/share';
import { LoginPage } from '../login/login';

import * as _ from 'underscore';

@Component({
  selector: 'pts-header',
  templateUrl: 'header.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild(Navbar) navbar: Navbar
  @Input() headerIpt: any = {
    catalogfacility: false,
    shareCnt: undefined
  };
tabBarElement: any;
msg = "";
back: boolean = false;
// playvideo = false;
// videosrc = "";
catalogfacility: false;
color: string = "#dddddd";
font: string = "black";
timeOut: any = 0;
menu: boolean = false;
toggleUserMenu: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private g: Global, private app: App) {
    console.log(this.headerIpt);
    this.tabBarElement = document.querySelector('#product-root-tab div:first-child');
    console.log("tabBarElement")
    console.log(this.tabBarElement);
    // watch network for a disconnect
    g.disconnectSubscription = g.network.onDisconnect().subscribe(() => {
      this.setMsg(50000005);
    });

    // watch network for a connection
    g.connectSubscription = g.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
          this.setMsg(20000009);
      }, 3000);
    });
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.setShareCount();
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.g.disconnectSubscription.unsubscribe();
    this.g.connectSubscription.unsubscribe();
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
      if(this.tabBarElement !== null)
        this.tabBarElement.style.display = 'flex';
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

  goToCatalog(val: any, seltype: any){
    console.log(seltype);
    var obj = {
      header: {
        type: val
      }
    };
    if(seltype){
      obj.header['seltype'] = seltype;
    }
    this.navCtrl.push(CatalogPage, obj);
  }

  openSharePage(){
    this.app.getRootNav().setRoot(SharePage);
  }

  logout(){
    localStorage.removeItem('token');
    this.app.getRootNav().setRoot(LoginPage);
  }
  
  // closeVid(){
  //   this.videosrc = "";
  //   this.playvideo = false;
  //   if(this.tabBarElement !== null)
  //     this.tabBarElement.style.display = 'flex';
  // }

  // playVideo(url: any){
  //   console.log(url);
  //   this.videosrc = url;
  //   this.playvideo = true;
  //   if(this.tabBarElement !== null)
  //     this.tabBarElement.style.display = 'none';
  // }
}
