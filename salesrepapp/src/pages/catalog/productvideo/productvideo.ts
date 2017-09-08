import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VideoPlayer } from '@ionic-native/video-player';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-productvideo',
  templateUrl: 'productvideo.html',
})
export class ProductVideoPage {
data: any;
title: any;
video: any;
type: any;
info: any;
tit: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private videoPlayer: VideoPlayer, private file: File) {
    console.log('ProductVideoPage ----------------------')
    console.log(navParams.data);
    this.info = navParams.data;
    this.data = this.info.data[0];
    this.type = this.info.type;
    this.tit = this.type + "_nm";
    this.title = this.data[this.tit];
    this.video = this.data.video;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductVideoPage');
  }

  viewVideo(url: string){
     this.videoPlayer.play(this.file.applicationDirectory  + 'www/' + url).then(() => {
          console.log('video completed');
        }).catch(err => {
          console.log("Video Player Err ---->")
          console.log(err);
      });
  }

}
