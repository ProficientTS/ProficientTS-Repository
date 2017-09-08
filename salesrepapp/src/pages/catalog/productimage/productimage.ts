import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private photoViewer: PhotoViewer, private file: File
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
   
  }

  viewImg(url: string){
    console.log(url);
    let path = url.split('/').splice((url.split('/').length - 1), 1);
    let filenm = url.split('/')[(url.split('/').length - 1)]
    console.log(path);
    console.log(filenm);
    this.file.readAsDataURL(this.file.applicationDirectory  + 'www/' + path, filenm)
    .then((dataURL:string) => { 
      console.log(dataURL);
      this.photoViewer.show(dataURL)
    })
  }

}
