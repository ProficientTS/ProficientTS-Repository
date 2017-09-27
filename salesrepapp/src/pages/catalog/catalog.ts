import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductTabPage } from '../catalog/producttab/producttab';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { PartDetailPage } from '../catalog/partdetail/partdetail';
import { SetDetailPage } from '../catalog/setdetail/setdetail';

import { Global } from '../../providers/global';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { VideoPlayer } from '@ionic-native/video-player';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

import * as _ from 'underscore';

@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html',
})
export class CatalogPage {
   @ViewChild('input') myInput;
listItem = [];
display: boolean = false;
type = "key";
tab = false;
tabs = {
  systab: false,
  doctab: false,
  parttab: false,
  settab: false,
  techtab: false,
  vidtab: false,
  imgtab: false,
  favtab: false,
  rectab: false
};
txt = "";
keyval:any;
nomedia = true;
syslen = 0;
partlen = 0;
setlen = 0;
techlen = 0;
imglen = 0;
vidlen = 0;
doclen = 0;
favlen = 0;
reclen = 0;
placeH = "Keyword";
typList = false;
typListSys = [];
typListSet = [];
typListPrt = [];
headerOpt: any;
options: DocumentViewerOptions = {
  title: 'Proficient Documents'
};

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider,
  private g: Global,
  private document: DocumentViewer,
  private photoViewer: PhotoViewer,
  private videoPlayer: VideoPlayer,
  private file: File,
  private mail: EmailComposer) {
    
    console.log(Nedb);
    console.dir(Nedb);
    console.log(this.g.deviceId)
    console.log(this.g.Network)

    this.headerOpt = this.navParams.get('header');
     this.g.Network = true;
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CatalogPage');
    this.listItem = [];
    this.display = false;
    this.tab = false;
    this.txt = "";
    this.nomedia = true;
    this.typList = false;
    this.typListSys = [];
    this.typListSet = [];
    this.typListPrt = [];
  }

  ionViewCanEnter(){
    console.log('ionViewCanEnter CatalogPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CatalogPage');
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter CatalogPage');
    switch(this.headerOpt){
      case 'default':
          console.log("Renderer setF")
          this.myInput.setFocus();
      break;
      case 'product':
        this.showProduct();
      break;
      case 'approach':
        this.showTechniques();
      break;
      case 'favorites':
        this.showFavs();
      break;
      case 'recent':
        this.showRecents();
      break;
    }
    console.log(this.headerOpt);
  }

  showProduct() {
    var that = this;
    this.type = "system";
    this.display = true;
    this.tab = true;
    this.typList = false;
    console.log(this.g.Network)
    this.setTab('systab');
    if(this.g.Network){
      this.ws.postCall('list/system', {})
      .then((data: any) => {
        console.log(data)
        if(data.data.length)
          _.each(data.data, function(element, i){
              if(element.img.length){
                element["url"] = element.img[0].url;
              }
          });
        that.listItem = data.data;
        that.syslen = data.data.length;
      });
    }
    else{
      this.g.findQ(this.g.db.system, {voidfl : {$ne : 'Y'}})
        .then((docs: any) => {
            console.log(docs);
            var len = docs.length;
            if(len){
              _.each(docs, function(element, i){
                element["Name"] = element.system_nm;
                element["ID"] = element.system_id;
                if(element.img.length){
                  element["url"] = element.img[0].url;
                }
                if(i == (len-1)){
                  that.listItem = docs;
                  that.syslen = docs.length;
                }
              });
            }
            else{
              that.listItem = [];
              that.syslen = 0;
            }
            
          }) // here you will get it
          .catch((err) => console.error(err));
    }    
  }

  setTab(tab: any){
    
    Object.keys(this.tabs).forEach((key) => {
      this.tabs[key] = false;
    })
    this.tabs[tab] = true;
    
  }

  showTechniques() {
    var that = this;
    this.display = true;
    this.type = "technique";
    this.tab = true;
    this.setTab('techtab');
    this.typList = false;
    if(this.g.Network){
      this.ws.postCall('list/technique', {})
      .then((data: any) => {
        that.listItem = data.data;
        that.techlen = data.data.length;
      });
    }
    else{
      this.g.findQ(this.g.db.technique, {voidfl : {$ne : 'Y'}})
        .then((docs: any) => {
            console.log(docs);
            var len = docs.length;
            if(len){
              _.each(docs, function(element, i){
                element["Name"] = element.technique_nm;
                if(i == (len-1)){
                  that.listItem = docs;
                  that.techlen = docs.length;
                }
              });
            }
            else{
              that.listItem = [];
              that.techlen = 0;
            }
            
          }) // here you will get it
          .catch((err) => console.error(err));

    }
  }

  handleData(data: any){
      console.log(this.type)
      console.log(data);
    if(data.success){
      let typ = this.type;
      if(typ == "key"){
        // selected Tab
        if(this.tabs.systab){
          typ = 'system';
        }
        else if(this.tabs.parttab){
          typ = 'part';
        }
        else if(this.tabs.settab){
          typ = 'set';
        }
      }
      switch(typ){
        case "part":
          this.navCtrl.push(PartDetailPage, {
            data: data.data
          });
          break;
        case "set":
          this.navCtrl.push(SetDetailPage, {
            data: data.data
          });
          break;
        case "system":
          this.navCtrl.push(ProductTabPage, {
            data: data.data
          });
          break;
      }
      
    }   
  }

  searchItem(typ: any){
    console.log(this.txt);
    console.log(this.type)
    var that = this;
    this.typList = false;
    if(this.txt.length >= 3){
      this.display = true;
      this.tab = true;
      console.log(typ)
      this.type = typ;
      if(this.g.Network){
        console.log("oo")
        this.ws.postCall('list/' + this.type + '/name/' + this.txt, {})
        .then(data => {
          this.searchData(data);
        });
      }
      else if(this.type == "key"){
        var rst: any = {};
        var v = JSON.parse(JSON.stringify(this.txt));
        var f = v.split("")[0].toUpperCase() + v.slice(1);
        f = new RegExp(f);
        v = new RegExp(v);
        console.log(v)
        // , { "video.title": { $regex: f  } }, { "img.title": { $regex: f  } }, { "doc.title": { $regex: f  } }, { "video.title": { $regex: v  } }, { "img.title": { $regex: v  } }, { "doc.title": { $regex: v  }}
        this.g.findQ(this.g.db.system, { $or: [{ system_nm: { $regex: f } }, { system_nm: { $regex: v } }, { system_id: { $regex: v } }], voidfl : {$ne : 'Y'} })
        .then((system: any) => {
          console.log(system);
            var sys = [];
            for (var j = 0; j < system.length; j++) {
                if(system[j].img.length){
                  sys.push({Name: system[j].system_nm, ID: system[j].system_id, url: system[j].img[0].url});
                }
                else{
                  sys.push({Name: system[j].system_nm, ID: system[j].system_id});
                }
                
            }
            rst.system = sys;
            that.g.findQ(that.g.db.system, { $or: [{ "img.title": { $regex: f  } }, { "img.title": { $regex: v  } }], voidfl : {$ne : 'Y'} })
            .then((image: any) => {
              console.log(image);
                var img = [];
                for (var i = 0; i < image.length; i++) {
                    if (image[i].img.length) {
                        for (var j = 0; j < image[i].img.length; j++) {
                            img.push(image[i].img[j]);
                        }
                    }
                }
                rst.img = _.uniq(img);
                that.g.findQ(that.g.db.system, { $or: [{ "video.title": { $regex: f  } }, { "video.title": { $regex: v  } }], voidfl : {$ne : 'Y'} })
                .then((video: any) => {
                  console.log(video);
                    var vid = [];
                    for (var i = 0; i < video.length; i++) {
                        if (video[i].video.length) {
                            for (var j = 0; j < video[i].video.length; j++) {
                                vid.push(video[i].video[j]);
                            }
                        }
                    }
                    rst.video = _.uniq(vid);
                    that.g.findQ(that.g.db.system, { $or: [{ "doc.title": { $regex: f  } }, { "doc.title": { $regex: v  } }], voidfl : {$ne : 'Y'} })
                    .then((doc: any) => {
                      console.log(doc);
                        var docm = [];
                        for (var i = 0; i < doc.length; i++) {
                            if (doc[i].doc.length) {
                                for (var j = 0; j < doc[i].doc.length; j++) {
                                    docm.push(doc[i].doc[j]);
                                }
                            }
                        }
                        rst.doc = _.uniq(docm);
                        that.g.findQ(that.g.db.set, { $or: [{ set_nm: { $regex: f } }, { set_nm: { $regex: v } }, { set_id: { $regex: v } }], voidfl : {$ne : 'Y'} })
                        .then((set: any) => {
                            console.log(set);
                            var setArr = [];
                            for (var j = 0; j < set.length; j++) {
                                if(set[j].img.length){
                                  setArr.push({Name: set[j].set_nm, ID: set[j].set_id, url: set[j].img[0].url});
                                }
                                else{
                                  setArr.push({Name: set[j].set_nm, ID: set[j].set_id});
                                }
                            }
                            rst.set = setArr;
                            
                            that.g.findQ(that.g.db.part, { $or: [{ part_nm: { $regex: f } }, { part_nm: { $regex: v } }, { part_id: { $regex: v } }], voidfl : {$ne : 'Y'} })
                            .then((part: any) => {
                                console.log(part);
                                var partArr = [];
                                for (var j = 0; j < part.length; j++) {
                                    if(part[j].img.length){
                                      partArr.push({Name: part[j].part_nm, ID: part[j].part_id, url: part[j].img[0].url});
                                    }
                                    else{
                                      partArr.push({Name: part[j].part_nm, ID: part[j].part_id});
                                    }
                                }
                                rst.part = partArr;
                                that.searchData({data: rst});
                              }) // here you will get it
                              .catch((err) => console.error(err));
                            
                          }) // here you will get it
                          .catch((err) => console.error(err));

                      }) // here you will get it
                      .catch((err) => console.error(err));

                  }) // here you will get it
                  .catch((err) => console.error(err));

              }) // here you will get it
              .catch((err) => console.error(err));
            
          }) // here you will get it
          .catch((err) => console.error(err));
      }
      else{
        var query = {};
        // nedb not supporting case insensitivity
        var v = JSON.parse(JSON.stringify(this.txt));
        var f = v.split("")[0].toUpperCase() + v.slice(1);
        f = new RegExp(f);
        v = new RegExp(v);
        console.log(v)

        
        switch (this.type) {
            case 'part':
                query = { $or: [{ part_nm: { $regex: f } }, { part_nm: { $regex: v } }, { part_id: { $regex: v } }], voidfl : {$ne : 'Y'} };
                break;
            case 'set':
                query = { $or: [{ set_nm: { $regex: f } }, { set_nm: { $regex: v } }, { set_id: { $regex: v } }], voidfl : {$ne : 'Y'} };
                break;
            case 'system':
                query = { $or: [{ system_nm: { $regex: f } }, { system_nm: { $regex: v } }, { system_id: { $regex: v } }], voidfl : {$ne : 'Y'} };
                break;
            case 'technique':
                query = { $or: [{ technique_nm: { $regex: f } }, { technique_nm: { $regex: v } }], voidfl : {$ne : 'Y'} };
                break;
        }
        this.g.findQ(this.g.db[this.type], query)
        .then((docs: any) => {
            console.log(docs);
            var len = docs.length;
            if(len){
              _.each(docs, function(element, i){
                element["Name"] = element[that.type + '_nm'];
                if(that.type != 'technique')
                element["ID"] = element[that.type + '_id'];
                if(that.type != 'technique' && element.img.length){
                  element["url"] = element.img[0].url;
                }
                if(i == (len-1)){
                  that.searchData(docs);
                }
              });
            }
            else{
              that.listItem = [];
              switch(this.type){
                case 'part':
                  this.setTab('parttab');
                  this.partlen = 0;
                break;
                case 'set':
                  this.setTab('settab');
                  this.setlen = 0;
                break;
                case 'system':
                  this.setTab('systab');
                  this.syslen = 0;
                break;
                case 'technique':
                  this.setTab('techtab');
                  this.techlen = 0;
                break;
              }
            }
            
          }) // here you will get it
          .catch((err) => console.error(err));


      }
    }
    else{
      this.listItem = [];
      this.display = false;
      this.tab = false;
      this.nomedia = true;
    }
  }

  searchData(data: any){
    console.log(data);
    console.log(data.data);
    console.log(data.length)
    console.log(this.display)
    if(data.data){
      console.log(0)
      if(this.type == "key"){
        console.log(console.log(data.data))
        if(this.g.Network){
          if(data.data.system.length){
            _.each(data.data.system, function(element, i){
                if(element.img.length){
                  element["url"] = element.img[0].url;
                }
            });
          }
          if(data.data.set.length){
            _.each(data.data.set, function(element, i){
                if(element.img.length){
                  element["url"] = element.img[0].url;
                }
            });
          }
          if(data.data.part.length){
            _.each(data.data.part, function(element, i){
                if(element.img.length){
                  element["url"] = element.img[0].url;
                }
            });
          }
        }
        
        this.keyval = data.data;
        this.keyval.system = data.data.system;
        this.keyval.doc = data.data.doc;
        this.keyval.img = data.data.img;
        this.keyval.video = data.data.video;
        this.keyval.technique = [];
        this.keyval.set = data.data.set;
        this.keyval.part = data.data.part;
        this.listItem = data.data.system;
        this.syslen = data.data.system.length;
        this.doclen = data.data.doc.length;
        this.imglen = data.data.img.length;
        this.vidlen = data.data.video.length;
        this.partlen = data.data.part.length;
        this.setlen = data.data.set.length;
        this.setTab('systab');
      }
      else{
        if(data.data.length && this.type != "technique")
          _.each(data.data, function(element, i){
              if(element.img.length){
                element["url"] = element.img[0].url;
              }
          });
        this.listItem = data.data;
        switch(this.type){
          case 'part':
            this.setTab('parttab');
            this.partlen = data.data.length;
          break;
          case 'set':
            this.setTab('settab');
            this.setlen = data.data.length;
          break;
          case 'system':
            this.setTab('systab');
            this.syslen = data.data.length;
          break;
          case 'technique':
            this.setTab('techtab');
            this.techlen = data.data.length;
          break;
        }
      }
    }
    else if(data.length){
      console.log(1);
      this.listItem = data;
      switch(this.type){
        case 'part':
          this.setTab('parttab');
          this.partlen = data.length;
        break;
        case 'set':
          this.setTab('settab');
          this.setlen = data.length;
        break;
        case 'system':
          this.setTab('systab');
          this.syslen = data.length;
        break;
        case 'technique':
          this.setTab('techtab');
          this.techlen = data.length;
        break;
      }
    }
    else{
      console.log(2)
      this.listItem = [];
      switch(this.type){
          case 'part':
            this.setTab('parttab');
            this.partlen = 0;
          break;
          case 'set':
            this.setTab('settab');
            this.setlen = 0;
          break;
          case 'system':
            this.setTab('systab');
            this.syslen = 0;
          break;
          case 'technique':
            this.setTab('techtab');
            this.techlen = 0;
          break;
        }
    }
    console.log(this.listItem)
  }

  itemTapped(item) {
    console.log(item)
    console.log(this.type)
    console.log(item.type);
    if(item.type){ // Recent and Favorites
      this.type = item.type;
    }
    var that = this;
    if(this.type === "technique" && item.ID === undefined){
      this.setTab('systab');
      this.type = 'system';
      if(this.g.Network){
        this.ws.postCall('list/technique/'+ item.Name + '/system' , {})
        .then((data: any) => {
          console.log(data.data)
          if(data.data.length)
            _.each(data.data, function(element, i){
                if(element.img.length){
                  element["url"] = element.img[0].url;
                }
            });
          that.listItem = data.data;
          that.syslen = data.data.length;
        });
      }
      else{
        this.g.findQ(this.g.db.system, { "technique.technique_nm": {$in: [item.Name]}, voidfl : {$ne : 'Y'} })
          .then((docs: any) => {
              console.log(docs);
              var len = docs.length;
              if(len){
                _.each(docs, function(element, i){
                  element["Name"] = element.system_nm;
                  element["ID"] = element.system_id;
                  if(element.img.length){
                    element["url"] = element.img[0].url;
                  }
                  if(i == (len-1)){
                    that.listItem = docs;
                    that.syslen = docs.length;
                  }
                });
              }
              else{
                that.listItem = [];
                that.syslen = 0;
              }
              
            }) // here you will get it
            .catch((err) => console.error(err));
      }
    }
    else if(this.type == "key" && (this.tabs.doctab || this.tabs.imgtab || this.tabs.vidtab)){

    }
    else{

      let typ = this.type;
      if(typ == "key"){
        // selected Tab
        if(this.tabs.systab){
          typ = 'system';
        }
        else if(this.tabs.parttab){
          typ = 'part';
        }
        else if(this.tabs.settab){
          typ = 'set';
        }
      }
      if(this.g.Network){
        this.ws.postCall('display/'+typ+'/'+ item.ID, {})
        .then(data => {
          this.handleData(data);
        });
      }
      else{
        var that = this;
        var query = {voidfl : {$ne : 'Y'}};
        query[typ + '_id'] = item.ID;
        

        this.g.findQ(this.g.db[typ], query)
          .then((docs: any) => {
            console.log(docs);
            switch(typ){
              case "part":
                that.navCtrl.push(PartDetailPage, {
                  data: docs
                });
                break;
              case "set":
                that.navCtrl.push(SetDetailPage, {
                  data: docs
                });
                break;
              case "system":
                that.navCtrl.push(ProductTabPage, {
                  data: docs
                });
                break;
            }
            
          }) // here you will get it
          .catch((err) => console.error(err));
      }
    }

  }

  

  showFavs(){
    var that = this;
    this.type = "fav";
    this.tab = true;
    this.setTab('favtab');
    this.g.findQSSL(this.g.db.fav, {accountID: localStorage.getItem('email'), fav: true}, {type: -1}, 0, 0)
      .then((docs: any) => {
        console.log(docs);
        that.typList = true;
        that.listItem = [];
        that.display = false;
        that.typListSys = _.filter(docs, (v) => {
          return v.type == "system";
        });
        that.typListSet = _.filter(docs, (v) => {
          return v.type == "set";
        });
        that.typListPrt = _.filter(docs, (v) => {
          return v.type == "part";
        });

        that.favlen = docs.length;
      }) // here you will get it
      .catch((err) => console.error(err));
  }
  
  showRecents(){
    var that = this;
    this.type = "rec";
    this.tab = true;
    this.setTab('rectab');
    this.g.findQSSL(this.g.db.recent, {accountID: localStorage.getItem('email')}, {type: -1, time: -1}, 0, 5)
      .then((docs: any) => {
        console.log(docs);
        that.typList = true;
        that.listItem = [];
        that.display = false;
        that.typListSys = _.filter(docs, (v) => {
          return v.type == "system";
        });
        that.typListSet = _.filter(docs, (v) => {
          return v.type == "set";
        });
        that.typListPrt = _.filter(docs, (v) => {
          return v.type == "part";
        });
        
        that.reclen = docs.length;
      }) // here you will get it
      .catch((err) => console.error(err));
  }

  selectTab(val: any, tab: any){
    console.log(val);
    if(val == 'doc' || val == 'img' || val == 'video'){
      this.nomedia = false;
    }
    else{
      this.nomedia = true;
    }

    if(this.type == "key"){
      this.listItem = this.keyval[val];
    }

    this.setTab(tab);

  }

  onChange(val: any){
    console.log(val);
    this.placeH = (val == "key") ? "Keyword" : val.split("")[0].toUpperCase() + val.slice(1);
    this.type = val;
    this.tab = false;
    this.listItem = [];
    this.display = false;
    this.txt = "";
    this.nomedia = true;
    this.typList = false;
  }

  viewMedia(url : string){
    console.log(url);
    if(this.tabs.doctab){
      this.document.viewDocument(this.file.applicationDirectory  + 'www/'+ url, 'application/octet-stream', this.options)
    }
    else if(this.tabs.imgtab){
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
    else if(this.tabs.vidtab){
      this.videoPlayer.play(this.file.applicationDirectory  + 'www/' + url).then(() => {
          console.log('video completed');
        }).catch(err => {
          console.log("Video Player Err ---->")
          console.log(err);
      });
    }
    
  }

  shareMedia(url: string){
    console.log(url);
    var that = this;
    // this.mail.isAvailable().then((available: boolean) =>{
    //   console.log("Email ---- " + available);
    //   if(available) {
        //Now we know we can send
        that.mail.open({
        to: 'cjchrist777@gmail.com',
        cc: 'christson_johnny@yahoo.com',
        bcc: [],
        attachments: [
          this.file.applicationDirectory  + 'www/'+ url
        ],
        subject: 'Cordova Icons by {P}',
        body: 'How are you? Nice greetings from {P}'
        // ,
        // isHtml: true
      });
    //   }
    // });
  }

}
