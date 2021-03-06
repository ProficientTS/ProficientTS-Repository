import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';

import { Global } from '../../providers/global';
import * as _ from 'underscore';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';

import { LoginPage } from '../login/login';

import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'page-share',
  templateUrl: 'share.html'
})
export class SharePage implements OnInit {
  @ViewChild(forwardRef(() => HeaderComponent))
private hc: HeaderComponent
shareD = {
  img: [],
  video: [],
  doc: []
};
sendBtn: boolean = true;
options: DocumentViewerOptions = {
  title: 'Proficient Documents',
  openWith: {
    enabled: true
  }
};
headerIpt = {
  // catalogfacility: true,
  shareCnt: 0,
  // title: "Review Page"
};
toArr: any = [];
ccArr: any = [];
toaddr: any = "";
ccaddr: any = "";
review: any = "";
share: boolean = true;
  constructor(public navCtrl: NavController,
  private ws: WebserviceProvider,
  private g: Global,
  private document: DocumentViewer,
  private photoViewer: PhotoViewer,
  private file: File,
  private app: App) {

  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    var that = this;
    this.g.findQSSL(this.g.db.share, {accountID: localStorage.getItem('email'), share: true}, {title: 1}, 0, 0)
    .then((rst: any) => {
      console.log(rst);
      this.shareD.img = _.filter(rst, (v) => {
        return v.type == "img"
      })
      this.shareD.video = _.filter(rst, (v) => {
        return v.type == "vid"
      })
      this.shareD.doc = _.filter(rst, (v) => {
        return v.type == "doc"
      })
    })
    .catch((err: any) => {
      console.log("Error fetching Share DB")
      console.log("Create Directory 1st")
      console.log(err);
    });
  }

  setToAddr(e: any){
    console.log(e);
    this.toaddr = this.toaddr.trim();
    if(this.toaddr.length && (e.key == "Enter" || e.key == "Space") && this.toArr.length < 6){
      var val = JSON.parse(JSON.stringify(this.toaddr));
      console.log(val);
      this.toArr.push(val);
      this.toaddr = "";
    }
  }

  setCCAddr(e: any){
    this.ccaddr = this.ccaddr.trim();
    if(this.ccaddr.length && (e.key == "Enter" || e.key == "Space") && this.ccArr.length < 6){
      var val = JSON.parse(JSON.stringify(this.ccaddr));
      console.log(val);
      this.ccArr.push(val);
      this.ccaddr = "";
    }
  }

  removeToAddr(val: any){
    console.log(val);
    this.toArr.splice(this.toArr.indexOf(val), 1);
  }

  removeCCAddr(val: any){
    console.log(val);
    this.ccArr.splice(this.ccArr.indexOf(val), 1);
  }

  viewMedia(type: any, item: any){
    console.log(type);
    // console.log(url);
    // if(type == "doc"){
    //   this.document.viewDocument(this.g.file.dataDirectory + 'ProficientTS Test Folder/' + url, 'application/pdf', this.options, undefined, undefined, undefined, (err) => {
    //     console.log(err);
    //     this.g.iab.create(this.g.server + url, '_system');
    //   })
    // }
    // else if(type == "img"){
    //   let path: any = url.split('/');
    //   path.pop();
    //   path = path.join('/');
    //   let filenm = url.split('/')[(url.split('/').length - 1)]
    //   console.log("Image ----------")
    //   console.log(path);
    //   console.log(filenm);
    //   this.file.readAsDataURL(this.g.file.dataDirectory + 'ProficientTS Test Folder/' + path, filenm)
    //   .then((dataURL:string) => { 
    //     console.log("dataURL -------------");
    //     // console.log(dataURL);
    //     this.photoViewer.show(dataURL)
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //     this.g.iab.create(this.g.server + url);
    //   })
    // }
    // else if(type == "video"){
    //   this.hc.playVideo(url);
    // }
    this.g.iab.create(this.g.Network===true ? this.g.server + item.url : this.g.file.dataDirectory + 'ProficientTS Test Folder/' + item.url);
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), title: item.title, type: type, url: item.url }, {$set: {time: Number(new Date())}}, function(rst){
      console.log(rst);
    });
  }

  removeMedia(type: any, item: any, index: any){
    console.log(item);
    console.log(index);
    var that = this;
    if(this.sendBtn){
      let typ = (type == "video") ? "vid" : type
      console.log(typ)
      this.g.upsertQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: typ, url: item.url, title: item.title }, {$set: {share: false}}, function(rst){
        console.log(rst);
        if(rst){
          that.shareD[type].splice(index, 1);
        }
      });
    }
  }

  logOut(){
    console.log("logOut ========")
    localStorage.removeItem('token');
    this.app.getRootNav().setRoot(LoginPage);
  }

  sendMail(){
    if(this.toArr.length < 1){
      this.hc.setMsg(50000002);
      console.log("Provide To addr");
      return;
    }
    this.sendBtn = false;
    var shareData = JSON.parse(JSON.stringify(this.shareD));
    this.ws.postCall('sharemail', {
      data: shareData,
      review: (this.review.trim().length) ? this.review.trim() : "Share items",
      email: localStorage.getItem('email'),
      to: this.toArr,
      cc: this.ccArr
    })
    .then((data: any) => {
      console.log(data);
      this.sendBtn = true;
      if(data && data.msg == "InValid Credential"){
        this.logOut();
      }
      else if(data && data.success){
        // this.hc.msg = "Mail Shared";
        this.g.removeQ(this.g.db.share, {}, (status, numRemoved) => {
          if(status){
            console.log("share Reset Successful");
            this.hc.setMsg(20000007);
            console.log(numRemoved);
            this.shareD = {
                            img: [],
                            video: [],
                            doc: []
                          };
          }
          else{
            this.hc.setMsg(50000003);
            console.log("share Reset Failed");
          }
        });
      }
    }).catch((err: any) => {
      console.log(err);
      this.hc.setMsg(50000003);
      this.sendBtn = true;
    });
  }

}
