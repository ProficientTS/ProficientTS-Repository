import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

import { Global } from '../../../providers/global';

@Component({
  selector: 'page-productimage',
  templateUrl: 'productimage.html',
})
export class ProductImagePage implements OnInit {
data: any;
title: any;
img: any;
info: any;
tit: any;
type: any;
headerIpt = {
  catalogfacility: true,
  shareCnt: 0
}
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private photoViewer: PhotoViewer, private file: File,
  private mail: EmailComposer,
  private g: Global
  ) {
    console.log('ProductImagePage IN----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data[this.tit];
    this.img = this.data.img;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductImagePage');
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    var that = this;
    this.g.findQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: 'img', share: true})
      .then((imgs: any) => {
        for(var i = 0; i < imgs.length; i++){
          for(var j = 0; j < that.img.length; j++){
            if(that.img[j].title == imgs[i].title && that.img[j].url == imgs[i].url){
              that.img[j].share = true;
            }
          }
        }
      })
      .catch((err: any) => {

      });
  }

  viewImg(url: string){
    console.log(url);
    let path: any = url.split('/');
    path.pop();
    path = path.join('/');
    let filenm = url.split('/')[(url.split('/').length - 1)]
    console.log(path);
    console.log(filenm);
    this.file.readAsDataURL(this.file.applicationDirectory  + 'www/' + path, filenm)
    .then((dataURL:string) => { 
      // console.log(dataURL);
      this.photoViewer.show(dataURL)
    })
  }

  shareImg(item: any, index: any){
    console.log(item);
    var that = this;

    let share = (item.share === undefined) ? true : !item.share;
    console.log(index);
    this.g.upsertQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: 'img', url: item.url, title: item.title }, {$set: {share: share}}, function(rst){
      console.log(rst);
      if(rst){
        that.img[index].share = share;
        that.headerIpt.shareCnt = (share) ? ++that.headerIpt.shareCnt : --that.headerIpt.shareCnt;
      }
    });
  }


}
