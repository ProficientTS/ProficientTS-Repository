import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { ProductTabPage } from '../catalog/producttab/producttab';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { PartDetailPage } from '../catalog/partdetail/partdetail';
import { SetDetailPage } from '../catalog/setdetail/setdetail';
import { LoginPage } from '../login/login';

import { Global } from '../../providers/global';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { VideoPlayer } from '@ionic-native/video-player';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

import * as _ from 'underscore';

import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html',
})
export class CatalogPage implements OnInit {
   @ViewChild('input') myInput;
   @ViewChild(HeaderComponent) hc: HeaderComponent;
listItem = [];
display: boolean = false;
type = "key";
tab = false;
headerIpt = {
  catalogfacility: false,
  shareCnt: 0
}
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
  title: 'Proficient Documents',
  openWith: {
    enabled: true
  }
};

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider,
  private g: Global,
  private document: DocumentViewer,
  private photoViewer: PhotoViewer,
  private videoPlayer: VideoPlayer,
  private file: File,
  private mail: EmailComposer,
  private app: App) {
    
    console.log(Nedb);
    console.dir(Nedb);
    console.log(this.g.deviceId)
    console.log(this.g.Network)

    this.headerOpt = this.navParams.get('header');
    // this.g.Network = true;
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  
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
    var typ = "";
    if(this.headerOpt){
      typ = this.headerOpt.type
    }
    switch(typ){
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
      case 'techsys':
        this.type = "technique";
        this.tab = true;
        this.itemTapped({Name: this.headerOpt.hdrData});
      break;
    }
    console.log(typ);
  }

  logOut(){
    console.log("logOut ========")
    localStorage.clear();
    this.app.getRootNav().setRoot(LoginPage);
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
        if(data && data.msg == "InValid Credential"){
          that.logOut();
        }
        else{
          if(data.data.length)
            _.each(data.data, function(element, i){
                if(element.img.length){
                  element["url"] = element.img[0].url;
                }
            });
          that.listItem = data.data;
          that.syslen = data.data.length;
        }
      });
    }
    else{
      this.g.findQSSL(this.g.db.system, {voidfl : {$ne : 'Y'}}, {system_nm: 1}, 0, 0)
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
        if(data && data.msg == "InValid Credential"){
          that.logOut();
        }
        else{
          that.listItem = data.data;
          that.techlen = data.data.length;
        }
      });
    }
    else{
      this.g.findQSSL(this.g.db.technique, {voidfl : {$ne : 'Y'}}, {technique_nm: 1}, 0, 0)
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
    this.txt = this.txt.trim();
    if(this.txt.length >= 3){
      this.display = true;
      this.tab = true;
      console.log(typ)
      this.type = typ;
      if(this.g.Network){
        this.ws.postCall('list/' + this.type + '/name/' + this.txt, {})
        .then((data: any) => {
          if(data && data.msg == "InValid Credential"){
            that.logOut();
          }
          else{
            this.searchData(data);
          }
        });
      }
      else if(this.type == "key"){
        var rst: any = {};
        var v = JSON.parse(JSON.stringify(this.txt));
        v = new RegExp(v, 'i');
        console.log(v)
        this.g.findQSSL(this.g.db.system, { $or: [{ system_nm: { $regex: v } }, { system_id: { $regex: v } }], voidfl : {$ne : 'Y'} }, {system_nm: 1}, 0, 0)
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
            that.g.findQSSL(that.g.db.file, { file_type: "img", title: { $regex: v }, voidfl : {$ne : 'Y'} }, {title: 1}, 0, 0)
            .then((image: any) => {
              console.log(image);
                rst.img = _.uniq(image);
                that.g.findQSSL(that.g.db.file, { file_type: "video", title: { $regex: v }, voidfl : {$ne : 'Y'} }, {title: 1}, 0, 0)
                .then((video: any) => {
                  console.log(video);
                    rst.video = _.uniq(video);
                    that.g.findQSSL(that.g.db.file, { file_type: "doc", title: { $regex: v }, voidfl : {$ne : 'Y'} }, {title: 1}, 0, 0)
                    .then((doc: any) => {
                      console.log(doc);
                        rst.doc = _.uniq(doc);
                        that.g.findQSSL(that.g.db.set, { $or: [{ set_nm: { $regex: v } }, { set_id: { $regex: v } }], voidfl : {$ne : 'Y'} }, {set_nm: 1}, 0, 0)
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
                            
                            that.g.findQSSL(that.g.db.part, { $or: [{ part_nm: { $regex: v } }, { part_id: { $regex: v } }], voidfl : {$ne : 'Y'} }, {part_nm: 1}, 0, 0)
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
        var query = {},
            sort = {};
        // nedb not supporting case insensitivity
        var v = JSON.parse(JSON.stringify(this.txt));
        v = new RegExp(v, 'i');
        console.log(v)

        
        switch (this.type) {
            case 'part':
                query = { $or: [{ part_nm: { $regex: v } }, { part_id: { $regex: v } }], voidfl : {$ne : 'Y'} };
                sort = { part_nm: 1 };
                break;
            case 'set':
                query = { $or: [{ set_nm: { $regex: v } }, { set_id: { $regex: v } }], voidfl : {$ne : 'Y'} };
                sort = { set_nm: 1 };
                break;
            case 'system':
                query = { $or: [{ system_nm: { $regex: v } }, { system_id: { $regex: v } }], voidfl : {$ne : 'Y'} };
                sort = { system_nm: 1 };
                break;
            case 'technique':
                query = { $or: [{ technique_nm: { $regex: v } }], voidfl : {$ne : 'Y'} };
                sort = { technique_nm: 1 };
                break;
        }
        this.g.findQSSL(this.g.db[this.type], query, sort, 0, 0)
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
    var that = this;
    console.log(data);
    console.log(data.data);
    console.log(data.length)
    console.log(this.display)
    if(data.data){
      console.log(0)
      if(this.type == "key"){
        console.log(console.log(data.data))

        this.g.findQ(this.g.db.share, {accountID: localStorage.getItem('email'), share: true})
        .then((docs: any) => {
          console.log(docs);
          for(var i = 0; i < docs.length; i++){
            for(var j = 0; j < data.data.img.length; j++){
              if(data.data.img[j].title == docs[i].title && data.data.img[j].url == docs[i].url && docs[i].type == "img"){
                data.data.img[j].share = true;
              }
            }
            for(var k = 0; k < data.data.video.length; k++){
              if(data.data.video[k].title == docs[i].title && data.data.video[k].url == docs[i].url && docs[i].type == "vid"){
                data.data.video[k].share = true;
              }
            }
            for(var l = 0; l < data.data.doc.length; l++){ 
              if(data.data.doc[l].title == docs[i].title && data.data.doc[l].url == docs[i].url && docs[i].type == "doc"){
                data.data.doc[l].share = true;
              }
            }
          }

          if(that.g.Network){
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
          console.log("Finaleeee -------")
          console.log(data.data);
          that.keyval = data.data;
          that.keyval.system = data.data.system;
          that.keyval.doc = data.data.doc;
          that.keyval.img = data.data.img;
          that.keyval.video = data.data.video;
          that.keyval.technique = [];
          that.keyval.set = data.data.set;
          that.keyval.part = data.data.part;
          that.listItem = data.data.system;
          that.syslen = data.data.system.length;
          that.doclen = data.data.doc.length;
          that.imglen = data.data.img.length;
          that.vidlen = data.data.video.length;
          that.partlen = data.data.part.length;
          that.setlen = data.data.set.length;
          that.setTab('systab');
          
        })
        .catch((err)=> console.log(err));

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
    if(item.type && (this.tabs.favtab || this.tabs.rectab)){ // Recent and Favorites
      this.type = item.type;
    }
    var that = this;
    if(this.type === "technique" && item.ID === undefined){
      this.setTab('systab');
      this.type = 'system';
      if(this.g.Network){
        this.ws.postCall('list/technique/'+ item.Name + '/system' , {})
        .then((data: any) => {
          if(data && data.msg == "InValid Credential"){
            that.logOut();
          }
          else{
            console.log(data.data)
            if(data.data.length)
              _.each(data.data, function(element, i){
                  if(element.img.length){
                    element["url"] = element.img[0].url;
                  }
              });
            that.listItem = data.data;
            that.syslen = data.data.length;
          }
        });
      }
      else{
        this.g.findQSSL(this.g.db.system, { "technique.technique_nm": {$in: [item.Name]}, voidfl : {$ne : 'Y'} },{ system_nm: 1}, 0, 0)
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
      // Do not remove this condition
    }
    else {

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
        .then((data: any) => {
          if(data && data.msg == "InValid Credential"){
            that.logOut();
          }
          else{
            this.handleData(data);
          }
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
      this.document.viewDocument(this.file.applicationDirectory  + 'www/'+ url, 'application/pdf', this.options)
    }
    else if(this.tabs.imgtab){
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
    else if(this.tabs.vidtab){
      this.videoPlayer.play(this.file.applicationDirectory  + 'www/' + url).then(() => {
          console.log('video completed');
        }).catch(err => {
          console.log("Video Player Err ---->")
          console.log(err);
      });
    }
    
  }

  shareMedia(item: any, index: any){
    console.log(this.tab);
    console.log(this.type)
    var that = this;
    console.log(item);
    let typ = "";
    if(this.tabs.imgtab){
      typ = 'img';
    }
    else if(this.tabs.vidtab){
      typ = 'vid';
    }
    else if(this.tabs.doctab){
      typ = 'doc';
    }

    let share = (item.share === undefined) ? true : !item.share;
    console.log(index);
    console.log(this.listItem)
    this.g.upsertQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: typ, url: item.url, title: item.title }, {$set: {share: share}}, function(rst){
      console.log(rst);
      if(rst){
        that.listItem[index].share = share;
        that.headerIpt.shareCnt = (share) ? ++that.headerIpt.shareCnt : --that.headerIpt.shareCnt;
      }
    });
  }

}
