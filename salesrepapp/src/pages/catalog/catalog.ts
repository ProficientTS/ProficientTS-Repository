import { Component } from '@angular/core';
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
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CatalogPage');
    this.listItem = [];
    this.display = false;
    this.tab = false;
    this.txt = "";
    this.nomedia = true;
  }

  ionViewCanEnter(){
    console.log('ionViewCanEnter CatalogPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CatalogPage');
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter CatalogPage');
  }

  showProduct() {
    this.type = "system";
    this.display = true;
    this.tab = true;
    console.log(this.g.Network)
    this.setTab('systab');
    if(this.g.Network){
      this.ws.postCall('list/system', {})
      .then((data: any) => {
        that.listItem = data.data;
        that.syslen = data.data.length;
      });
    }
    else{
      var that = this;
      this.g.findQ(this.g.db.system, {voidfl : {$ne : 'Y'}})
        .then((docs: any) => {
            console.log(docs);
            var len = docs.length;
            if(len){
              _.each(docs, function(element, i){
                element["Name"] = element.system_nm;
                element["ID"] = element.system_id;
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
    this.display = true;
    this.type = "technique";
    this.tab = true;
    this.setTab('techtab')
    if(this.g.Network){
      this.ws.postCall('list/technique', {})
      .then((data: any) => {
        that.listItem = data.data;
        that.techlen = data.data.length;
      });
    }
    else{
      var that = this;
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
    if(data.success){
      switch(this.type){
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
    if(this.txt.length >= 3){
      this.display = true;
      this.tab = true;
      console.log(typ)
      this.type = typ;
      if(this.g.Network){
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
        this.g.findQ(this.g.db.system, { $or: [{ system_nm: { $regex: f } }, { system_nm: { $regex: v } }, { system_id: { $regex: v } }, { "video.title": { $regex: f  } }, { "img.title": { $regex: f  } }, { "doc.title": { $regex: f  } }, { "video.title": { $regex: v  } }, { "img.title": { $regex: v  } }, { "doc.title": { $regex: v  } }], voidfl : {$ne : 'Y'} })
        .then((system: any) => {
            console.log(system);
            var img = [],
                video = [],
                doc = [];
            if(system.length){
              for (var i = 0; i < system.length; i++) {
                if (system[i].img.length) {
                    for (var j = 0; j < system[i].img.length; j++) {
                        img.push(system[i].img[j]);
                    }
                }
                if (system[i].video.length) {
                    for (var k = 0; k < system[i].video.length; k++) {
                        video.push(system[i].video[k]);
                    }
                }
                if (system[i].doc.length) {
                    for (var l = 0; l < system[i].doc.length; l++) {
                        doc.push(system[i].doc[l]);
                    }
                }
                delete system[i].img;
                delete system[i].video;
                delete system[i].doc;
              }
              
              _.each(system, function(element, i){
                element["Name"] = element['system_nm'];
                element["ID"] = element['system_id'];
                if(i == (system.length-1)){
                  rst.system = system;
                  rst.img = img;
                  rst.video = video;
                  rst.doc = doc;
                }
              });
            }
            else{
              rst.system = [];
              rst.img = [];
              rst.video = [];
              rst.doc = [];
            }
            that.g.findQ(that.g.db.set, { $or: [{ set_nm: { $regex: f } }, { set_nm: { $regex: v } }, { set_id: { $regex: v } }], voidfl : {$ne : 'Y'} })
            .then((set: any) => {
                console.log(set);
                if(set.length){
                  _.each(set, function(element, i){
                    element["Name"] = element['set_nm'];
                    element["ID"] = element['set_id'];
                    if(i == (set.length-1)){
                      rst.set = set;
                    }
                  });
                }
                else{
                  rst.set = [];
                }
                
                that.g.findQ(that.g.db.part, { $or: [{ part_nm: { $regex: f } }, { part_nm: { $regex: v } }, { part_id: { $regex: v } }], voidfl : {$ne : 'Y'} })
                .then((part: any) => {
                    console.log(part);
                    if(part.length){
                      _.each(part, function(element, i){
                        element["Name"] = element['part_nm'];
                        element["ID"] = element['part_id'];
                        if(i == (part.length-1)){
                          rst.part = part;
                        }
                      });
                    }
                    else{
                      rst.part = [];
                    }
                    that.searchData({data: rst});
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
    if(item.type){
      this.type = item.type;
    }
    if(this.type === "technique" && item.ID === undefined){
      this.setTab('systab');
      this.type = 'system';
      if(this.g.Network){
        this.ws.postCall('list/technique/'+ item.Name + '/system' , {})
        .then((data: any) => {
          that.listItem = data.data;
          that.syslen = data.data.length;
        });
      }
      else{
        var that = this;
        this.g.findQ(this.g.db.system, { "technique.technique_nm": {$in: [item.Name]}, voidfl : {$ne : 'Y'} })
          .then((docs: any) => {
              console.log(docs);
              var len = docs.length;
              if(len){
                _.each(docs, function(element, i){
                  element["Name"] = element.system_nm;
                  element["ID"] = element.system_id;
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
    // else if(this.type === "technique" && item.ID !== undefined){
    //   if(this.g.Network){
    //     this.ws.postCall('display/system/'+ item.ID, {})
    //     .then(data => {
    //       this.handleData(data);
    //     });
    //   }
    //   else{
    //     var that = this;
    //     this.g.findQ(this.g.db.system, { system_id: item.ID, voidfl : {$ne : 'Y'} })
    //       .then((docs: any) => {
    //         console.log(docs);
    //         that.navCtrl.push(ProductTabPage, {
    //           data: docs
    //         });
            
    //       }) // here you will get it
    //       .catch((err) => console.error(err));
    //   }
    // }
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

  freshsync(){
    var that = this;
    that.g.db.devicesync.find({email: localStorage.getItem('email'), deviceID: this.g.deviceId, voidfl : {$ne : 'Y'}}, function(err, doc){
      console.log(err);
      console.log(doc);
      if(doc.length == 0){
        that.ws.postCall('sync', {email: localStorage.getItem('email'), deviceID: that.g.deviceId})
          .then(data => {
            that.syncService(data);
          });
      }
      else{
        console.log("Already Synced!")
      }
    });
    
  }

  getupdates(){
    var that = this;
    that.g.db.devicesync.find({email: localStorage.getItem('email'), deviceID: this.g.deviceId, voidfl : {$ne : 'Y'}}, function(err, doc){
      console.log(err);
      console.log(doc);
      if(doc.length){
        that.ws.postCall('sync', {email: localStorage.getItem('email'), update: 'Y', deviceID: that.g.deviceId})
        .then(data => {
          that.updateService(data);
        });
      }
      else{
        console.log("Full Sync First!")
      }
    });

  }

  resetdata(){
    var db = this.g.db;
    db.part.remove({}, { multi: true }, function (err, numRemoved) {
      if(err)
        console.log("Part Reset Failed");
      else{
        console.log("Part Reset Successful");
        console.log(numRemoved);
      }
      db.set.remove({}, { multi: true }, function (err, numRemoved) {
        if(err)
          console.log("Set Reset Failed");
        else{
          console.log("Set Reset Successful");
          console.log(numRemoved);
        }
        db.system.remove({}, { multi: true }, function (err, numRemoved) {
          if(err)
            console.log("System Reset Failed");
          else{
            console.log("System Reset Successful");
            console.log(numRemoved);
          }
          db.technique.remove({}, { multi: true }, function (err, numRemoved) {
            if(err)
              console.log("Technique Reset Failed");
            else{
              console.log("Technique Reset Successful");
              console.log(numRemoved);
            }
            db.devicesync.remove({}, { multi: true }, function (err, numRemoved) {
              if(err)
                console.log("Devicesync Reset Failed");
              else{
                console.log("Devicesync Reset Successful");
                console.log(numRemoved);
              }
              db.fav.remove({}, { multi: true }, function (err, numRemoved) {
                if(err)
                  console.log("Fav Reset Failed");
                else{
                  console.log("Fav Reset Successful");
                  console.log(numRemoved);
                }
                db.recent.remove({}, { multi: true }, function (err, numRemoved) {
                  if(err)
                    console.log("Recent Reset Failed");
                  else{
                    console.log("Recent Reset Successful");
                    console.log(numRemoved);
                  }
                });
              });
            });
          });
        });
      });
    });
  }
  // more performance
  syncService(data: any){
    console.log(data);
    if(data.success){
      var db = this.g.db;
      if(data.data.part.length){
        db.part.insert(data.data.part, function(err, newDocs){
            if(err)
              console.log("Insert Failed");
            else{
              console.log("Parts Inserted Successfully");
              console.log(newDocs);
            }
          })
      }
      console.log(data.data.set);
      if(data.data.set.length){
        db.set.insert(data.data.set, function(err, newDocs){
            if(err)
              console.log("Insert Failed");
            else{
              console.log("Set Inserted Successfully");
              console.log(newDocs);
            }
          })
      }
      if(data.data.system.length){
        db.system.insert(data.data.system, function(err, newDocs){
            if(err)
              console.log("Insert Failed");
            else{
              console.log("System Inserted Successfully");
              console.log(newDocs);
            }
          })
      }
      if(data.data.technique.length){
        db.technique.insert(data.data.technique, function(err, newDocs){
            if(err)
              console.log("Insert Failed");
            else{
              console.log("Technique Inserted Successfully");
              console.log(newDocs);
            }
          })
      }

      db.devicesync.insert({fullsync: "Y", email: localStorage.getItem('email'), deviceID: this.g.deviceId}, function(err, newDocs){
        if(err)
          console.log("Insert Failed");
        else{
          console.log("Devicesync Inserted Successfully");
          console.log(newDocs);
        }
      })

    }
  }

  updateService(data: any){
    console.log(data);
    if(data.success && (data.data.length || Object.keys(data.data).length)){
      var db = this.g.db;
      if(data.data.part.length){
        for(var i = 0; i < data.data.part.length; i++){
          db.part.update({_id: data.data.part[i]['_id']}, data.data.part[i], {upsert: true}, function(err, numReplaced, upsert){
            if(err)
              console.log("Parts Update Failed");
            else{
              console.log("Parts Update Successfully");
              console.log(numReplaced);
              ////console.log(upsert);
            }
          })
        }
      }
      if(data.data.set.length){
        for(var i = 0; i < data.data.set.length; i++){
          db.set.update({_id: data.data.set[i]['_id']},data.data.set[i], {upsert: true}, function(err, numReplaced, upsert){
            if(err)
              console.log("Set Update Failed");
            else{
              console.log("Set Update Successfully");
              console.log(numReplaced);
              ////console.log(upsert);
            }
          })
        }
      }
      if(data.data.system.length){
        for(var i = 0; i < data.data.system.length; i++){
          db.system.update({_id: data.data.system[i]['_id']},data.data.system[i], {upsert: true}, function(err, numReplaced, upsert){
            if(err)
              console.log("System Update Failed");
            else{
              console.log("System Update Successfully");
              console.log(numReplaced);
              ////console.log(upsert);
            }
          })
        }
      }
      if(data.data.technique.length){
        for(var i = 0; i < data.data.technique.length; i++){
          db.technique.update({_id: data.data.technique[i]['_id']},data.data.technique[i], {upsert: true}, function(err, numReplaced, upsert){
            if(err)
              console.log("Technique Update Failed");
            else{
              console.log("Technique Update Successfully");
              console.log(numReplaced);
              ////console.log(upsert);
            }
          })
        }
      }
    }
    else{
      console.log("No updates for now!")
    }
  }

  showFavs(){
    var that = this;
    this.display = true;
    this.type = "fav";
    this.tab = true;
    this.setTab('favtab');
    this.g.findQ(this.g.db.fav, {accountID: localStorage.getItem('email'), fav: true})
      .then((docs: any) => {
        console.log(docs);
        that.listItem = docs;
        that.favlen = docs.length;
      }) // here you will get it
      .catch((err) => console.error(err));
  }
  
  showRecents(){
    var that = this;
    this.display = true;
    this.type = "rec";
    this.tab = true;
    this.setTab('rectab');
    this.g.findQSSL(this.g.db.recent, {accountID: localStorage.getItem('email')}, {time: -1}, 0, 5)
      .then((docs: any) => {
        console.log(docs);
        that.listItem = docs;
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
