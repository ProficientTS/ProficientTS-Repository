import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';

import { Global } from '../../providers/global';
import * as _ from 'underscore';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { VideoPlayer } from '@ionic-native/video-player';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

@Component({
  selector: 'page-share',
  templateUrl: 'share.html'
})
export class SharePage implements OnInit {
shareD = {
  img: [],
  video: [],
  doc: []
};
options: DocumentViewerOptions = {
  title: 'Proficient Documents',
  openWith: {
    enabled: true
  }
};
headerIpt = {
  // catalogfacility: true,
  // shareCnt: 0,
  title: "Review Page"
}
  constructor(public navCtrl: NavController,
  private ws: WebserviceProvider,
  private g: Global,
  private document: DocumentViewer,
  private photoViewer: PhotoViewer,
  private videoPlayer: VideoPlayer,
  private file: File,
  private mail: EmailComposer) {

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

    });
  }

  viewMedia(type: any, url: any){
    console.log(type);
    console.log(url);
    if(type == "doc"){
      this.document.viewDocument(this.file.applicationDirectory  + 'www/'+ url, 'application/pdf', this.options)
    }
    else if(type == "img"){
      let path: any = url.split('/');
      path.pop();
      path = path.join('/');
      let filenm = url.split('/')[(url.split('/').length - 1)]
      console.log("Image ----------")
      console.log(path);
      console.log(filenm);
      this.file.readAsDataURL(this.file.applicationDirectory  + 'www/' + path, filenm)
      .then((dataURL:string) => { 
        console.log("dataURL -------------");
        // console.log(dataURL);
        this.photoViewer.show(dataURL)
      })
      .catch((err: any) => {
        console.log("Pic Err -------------");
        console.log(err);
      })
    }
    else if(type == "video"){
      this.videoPlayer.play(this.file.applicationDirectory  + 'www/' + url).then(() => {
          console.log('video completed');
        }).catch(err => {
          console.log("Video Player Err ---->")
          console.log(err);
      });
    }
  }

  removeMedia(type: any, item: any, index: any){
    console.log(item);
    console.log(index);
    var that = this;
    let typ = (type == "video") ? "vid" : type
    console.log(typ)
    this.g.upsertQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: typ, url: item.url, title: item.title }, {$set: {share: false}}, function(rst){
      console.log(rst);
      if(rst){
        that.shareD[type].splice(index, 1);
      }
    });
  }

  sendMail(){
    // var arr = [];
    // for(var key in this.shareD){
    //   if(this.shareD[key].length){
    //     for(var a = 0; a < this.shareD[key].length; a++){
    //       arr.push(this.shareD[key][a]);
    //     }
    //   }
    // }
    // console.log(arr);
    // var msg = "";
    // for(var i = 0; i < arr.length; i++){
    //   msg = msg + "<li><a href = '"+ arr[i].url +"'>"+ arr[i].title +"</a></li>";
    // }
    // msg = (arr.length) ? "<ul>" + msg + "</ul>" : "";


    var msg = "";
    if(this.shareD.img.length){
      msg = msg + "<div> Pictures (" + this.shareD.img.length+ ")</div>";
      var txt = "";
      for(var i = 0; i < this.shareD.img.length; i++){
        txt = txt + "<li><a href = '"+ this.shareD.img[i].url +"'>"+ this.shareD.img[i].title +"</a></li>";
      }
      msg = msg + "<ul>" + txt + "</ul>";
    }
    if(this.shareD.video.length){
      msg = msg + "<div> Videos (" + this.shareD.video.length+ ")</div>";
      var txt = "";
      for(var i = 0; i < this.shareD.video.length; i++){
        txt = txt + "<li><a href = '"+ this.shareD.video[i].url +"'>"+ this.shareD.video[i].title +"</a></li>";
      }
      msg = msg + "<ul>" + txt + "</ul>";
    }
    if(this.shareD.doc.length){
      msg = msg + "<div> Documents (" + this.shareD.doc.length+ ")</div>";
      var txt = "";
      for(var i = 0; i < this.shareD.doc.length; i++){
        txt = txt + "<li><a href = '"+ this.shareD.doc[i].url +"'>"+ this.shareD.doc[i].title +"</a></li>";
      }
      msg = msg + "<ul>" + txt + "</ul>";
    }
    var body =
    `
      <html>
        <head>
          <title>Mail in Html</title>
        </head>
        <body>
          <p>
            <div>
              ` + msg + `
            </div>
          </p>
        </body>
      </html>
    `;
    console.log(body);
    this.mail.open({
      to: null,
      cc: null,
      bcc: null,
      attachments: null,
      subject: 'Media Files from {P}',
      body: body,
      isHtml: true
    });
  }

}
