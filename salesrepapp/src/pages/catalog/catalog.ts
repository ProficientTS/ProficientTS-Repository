import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, App, Platform } from 'ionic-angular';
import { ProductTabPage } from '../catalog/producttab/producttab';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { PartDetailPage } from '../catalog/partdetail/partdetail';
import { SetDetailPage } from '../catalog/setdetail/setdetail';
import { LoginPage } from '../login/login';

import { Global } from '../../providers/global';

import * as _ from 'underscore';

import { HeaderComponent } from '../header/header.component';

import { File, DirectoryEntry } from '@ionic-native/file';

@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html',
})
export class CatalogPage implements OnInit {
   @ViewChild(HeaderComponent) hc: HeaderComponent;
listItem = [];
templist = [];
display: boolean = false;
type = "key";
seltype: any = "key";
tab = false;
sync: boolean = false;
headerIpt = {
  shareCnt: 0
}
mainTabs: any = {
  system: false,
  technique: false,
  fav: false,
  rec: false
}
tabs = {
  systemtab: false,
  doctab: false,
  parttab: false,
  settab: false,
  techtab: false,
  vidtab: false,
  imgtab: false
};
txt = "";
srhtxt = "";
key:any;
fav:any = {};
rec: any = {};
nomedia = true;
systemlen = 0;
partlen = 0;
setlen = 0;
techlen = 0;
imglen = 0;
vidlen = 0;
doclen = 0;
headerOpt: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  private ws: WebserviceProvider,
  private g: Global,
  private app: App,
  private platform: Platform) {
    console.log(platform)
    console.log(Nedb);
    console.dir(Nedb);
    console.log(this.g.deviceId)
    this.headerOpt = this.navParams.get('header');
  }

  ngOnInit() {
    console.log(this.g.Lang)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    var that = this;
     this.g.findQSSL(this.g.db.devicesync, {}, {deviceID: 1}, 0, 0)
      .then((docs: any) => {
        if(docs.length && !this.g.reset){
          this.sync = false;
        }
        else{
          if(this.g.reset){
            this.g.reset = false;
          }
          this.sync = true;
          this.hc.setMsg(10000002);
          this.freshsync();
        }
      })
      .catch((err: any) => {
        console.log("Error fetching Device Sync DB")
        console.log("Create Directory at Settings Page 1st")
        console.log(err);
        this.sync = true;
      });
  }

  freshsync(){
    this.g.removeQ(this.g.db.part, {}, (status, numRemoved) => {
      if(status)
        console.log("Part Reset Successful");
      else{
        console.log("Part Reset Failed");
        console.log(numRemoved);
      }
      this.g.removeQ(this.g.db.set, {}, (status, numRemoved) => {
        if(status)
          console.log("Set Reset Successful");
        else{
          console.log("Set Reset Failed");
          console.log(numRemoved);
        }
        this.g.removeQ(this.g.db.system, {}, (status, numRemoved) => {
          if(status)
            console.log("System Reset Successful");
          else{
            console.log("System Reset Failed");
            console.log(numRemoved);
          }
          this.g.removeQ(this.g.db.technique, {}, (status, numRemoved) => {
            if(status)
              console.log("technique Reset Successful");
            else{
              console.log("technique Reset Failed");
              console.log(numRemoved);
            }
            this.g.removeQ(this.g.db.file, {}, (status, numRemoved) => {
              if(status)
                console.log("file Reset Successful");
              else{
                console.log("file Reset Failed");
                console.log(numRemoved);
              }
              this.g.removeQ(this.g.db.fav, {}, (status, numRemoved) => {
                if(status)
                  console.log("fav Reset Successful");
                else{
                  console.log("fav Reset Failed");
                  console.log(numRemoved);
                }
                this.g.removeQ(this.g.db.recent, {}, (status, numRemoved) => {
                  if(status)
                    console.log("recent Reset Successful");
                  else{
                    console.log("recent Reset Failed");
                    console.log(numRemoved);
                  }
                  this.g.removeQ(this.g.db.share, {}, (status, numRemoved) => {
                    if(status)
                      console.log("share Reset Successful");
                    else{
                      console.log("share Reset Failed");
                      console.log(numRemoved);
                    }
                    this.g.removeQ(this.g.db.devicesync, {}, (status, numRemoved) => {
                      if(status)
                        console.log("devicesync Reset Successful");
                      else{
                        console.log("devicesync Reset Failed");
                        console.log(numRemoved);
                      }
                      if(this.g.platform.is('cordova')){
                        this.g.file.removeRecursively(this.g.file.dataDirectory, 'ProficientTS Test Folder')
                        .then((success: any) => {
                          console.log("Directory Removed");
                          console.log(success);
                        })
                        .catch((err: any) => {
                          console.log("Error Removing Directory");
                          console.log(err);
                        })
                      }
                      this.ws.postCall('sync', {email: localStorage.getItem('email'), deviceID: this.g.deviceId})
                      .then((data: any) => {
                        if(data && data.msg == "InValid Credential"){
                          this.logOut();
                        }
                        else{
                          this.syncService(data);
                        }
                      });
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
    
    
  }

  // more performance
  syncService(data: any){
    console.log(data);
    var that = this;
    if(data.success){
      this.g.insertQ(this.g.db.part, data.data.part, (partstatus, part) => {
        if(partstatus){
          console.log("Parts Inserted Successfully");
          console.log(part);
        }
        else{
          console.log("Insert Failed");
        }
        this.g.insertQ(this.g.db.set, data.data.set, (setstatus, set) => {
          if(setstatus){
            console.log("sets Inserted Successfully");
            console.log(set);
          }
          else{
            console.log("Insert Failed");
          }
          this.g.insertQ(this.g.db.system, data.data.system, (systemstatus, system) => {
            if(systemstatus){
              console.log("systems Inserted Successfully");
              console.log(system);
            }
            else{
              console.log("Insert Failed");
            }
            this.g.insertQ(this.g.db.technique, data.data.technique, (techniquestatus, technique) => {
              if(techniquestatus){
                console.log("techniques Inserted Successfully");
                console.log(technique);
              }
              else{
                console.log("Insert Failed");
              }
              this.g.insertQ(this.g.db.file, data.data.file, (filestatus, file) => {
                if(filestatus){
                  console.log("files Inserted Successfully");
                  console.log(file);
                }
                else{
                  console.log("Insert Failed");
                }
                this.g.insertQ(this.g.db.devicesync, {}, (devicesyncstatus, devicesync) => {
                  if(devicesyncstatus){
                    console.log("devicesyncs Inserted Successfully");
                    console.log(devicesync);
                  }
                  else{
                    console.log("Insert Failed");
                  }
                  this.sync = false;
                  this.hc.setMsg(20000002);
                  if(this.platform.is('cordova'))
                    this.g.FileSync();
                })
              })
            })
          })
        })
      })
    }
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CatalogPage');
    this.listItem = [];
    this.templist = [];
    this.type = 'key';
    this.seltype = 'key';
    this.display = false;
    this.tab = false;
    this.txt = "";
    this.nomedia = true;
    this.setMainTab('');
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
      case 'product':
        this.setMainTab('system');
        this.showProduct();
      break;
      case 'technique':
        this.setMainTab('technique');
        this.showTechniques();
      break;
      case 'favorites':
        this.setMainTab('fav');
        this.showFavs();
      break;
      case 'recent':
        this.setMainTab('rec');
        this.showRecents();
      break;
      case 'techsys':
        this.setMainTab('');
        this.type = "technique";
        this.tab = true;
        this.itemTapped({id: this.headerOpt.hdrData});
      break;
      case 'search':
      this.setMainTab('');
        this.type = this.headerOpt.seltype;
        this.seltype = this.type;
      break;
      case '':
        this.setMainTab('fav');
        this.showFavs();
      break;
    }
    console.log(typ);
  }

  sysTech(ID: any){
    console.log(ID)
    this.setMainTab('');
    this.type = "technique";
    this.tab = true;
    this.itemTapped({id: ID});
  }

  logOut(){
    console.log("logOut ========")
    localStorage.removeItem('token');
    this.app.getRootNav().setRoot(LoginPage);
  }

  showProduct() {
    var that = this;
    this.type = "system";
    this.display = true;
    this.nomedia = true;
    this.tab = true;
    this.setTab('systemtab');
    this.setMainTab('system');
    this.g.findQSSL(this.g.db.system, {voidfl : {$ne : 'Y'}}, {system_id: 1}, 0, 0)
      .then((docs: any) => {
          console.log(docs);
          var len = docs.length;
          if(len){
            this.g.findQSSL(this.g.db.fav, {fav: true, type: this.type}, { type: 1 }, 0, 0)
              .then((favs: any) => {
                console.log("Favorites", favs)
                _.each(docs, (element, i) => {
                  if(element[this.g.Lang]){
                    for(var key in element[this.g.Lang]){
                      element[key] = element[this.g.Lang][key];
                    }
                  }
                  element["Name"] = element.system_nm;
                  if(element.img.length){
                    element["url"] = element.img[0].url;
                  }
                  if(i == (len-1)){
                    for(var int = 0; int < favs.length; int++){
                      for(var j = 0; j < docs.length; j++){
                        if(docs[j].ID == favs[int].ID && docs[j].Name == favs[int].Name){
                          docs[j].fav = true;
                        }
                      }
                    }
                    console.log(docs)
                    this.listItem = docs;
                    this.templist = this.listItem;
                    this.systemlen = docs.length;
                  }
                });
              })
              .catch((err) => console.error(err));
          }
          else{
            this.listItem = [];
            this.templist = this.listItem;
            this.systemlen = 0;
          }
          
        }) // here you will get it
        .catch((err) => console.error(err)); 
  }

  setTab(tab: any){
    
    Object.keys(this.tabs).forEach((key) => {
      this.tabs[key] = false;
    })
    this.tabs[tab] = true;
    
  }

  setMainTab(tab: any){
    
    Object.keys(this.mainTabs).forEach((key) => {
      this.mainTabs[key] = false;
    })
    if(tab && tab.length)
      this.mainTabs[tab] = true;
    
  }

  showTechniques() {
    var that = this;
    this.display = true;
    this.type = "technique";
    this.tab = true;
    this.setTab('techtab');
    this.setMainTab('technique');
    this.nomedia = true;
    this.g.findQSSL(this.g.db.technique, {voidfl : {$ne : 'Y'}}, {technique_nm: 1}, 0, 0)
      .then((docs: any) => {
          console.log(docs);
          var len = docs.length;
          if(len){
            _.each(docs, (element, i)=>{
              element["Name"] = element.technique_nm;
              element["id"] = element.technique_id;
              if(i == (len-1)){
                that.listItem = docs;
                this.templist = this.listItem;
                that.techlen = docs.length;
              }
            });
          }
          else{
            that.listItem = [];
            this.templist = this.listItem;
            that.techlen = 0;
          }
          
        }) // here you will get it
        .catch((err) => console.error(err));
  }

  handleData(data: any){
      console.log(this.type)
      console.log(data);
    if(data.success){
      let typ = this.type;
      if(typ == "key"){
        // selected Tab
        if(this.tabs.systemtab){
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
    this.txt = this.txt.trim();
    if(this.txt.length >= 3){
      this.setMainTab('');
      this.display = true;
      this.tab = true;
      console.log(typ)
      this.type = typ;
      if(this.type == "key"){
        var rst: any = {};
        var v = JSON.parse(JSON.stringify(this.txt));
        v = new RegExp(v, 'i');
        console.log(v)
        this.g.findQSSL(this.g.db.system, { $or: [{ system_nm: { $regex: v } }, { system_id: { $regex: v } }], voidfl : {$ne : 'Y'} }, {system_nm: 1}, 0, 0)
        .then((system: any) => {
          console.log(system);
            var sys = [];
            
            for (var j = 0; j < system.length; j++) {
                if(system[j][this.g.Lang]){
                  for(var key in system[j][this.g.Lang]){
                    system[j][key] = system[j][this.g.Lang][key];
                  }
                }
                if(system[j].img.length){
                  sys.push({Name: system[j].system_nm, ID: system[j].system_id, url: system[j].img[0].url, technique: system[j].technique});
                }
                else{
                  sys.push({Name: system[j].system_nm, ID: system[j].system_id, technique: system[j].technique});
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
                if(element[that.g.Lang]){
                  for(var key in element[that.g.Lang]){
                    element[key] = element[that.g.Lang][key];
                  }
                }
                element["Name"] = element[that.type + '_nm'];
                if(that.type != 'technique')
                  element["ID"] = element[that.type + '_id'];
                else
                  element["id"] = element[that.type + '_id'];
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
              this.templist = this.listItem;
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
                  this.setTab('systemtab');
                  this.systemlen = 0;
                break;
                case 'technique':
                  this.setTab('techtab');
                  this.techlen = 0;
                break;
              }
            }
            
          }) 
          .catch((err) => console.error(err));
      }
    }
    else{
      this.listItem = [];
      this.templist = this.listItem;
      this.display = false;
      this.tab = false;
      this.nomedia = true;
      if(this.txt.length < 1)
        this.showFavs();
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
          this.g.findQSSL(this.g.db.fav, {fav: true}, { type: 1 }, 0, 0)
          .then((favs: any) => {
            console.log("Favorites", favs)
            for(var int = 0; int < favs.length; int++){
              for(var j = 0; j < data.data.img.length; j++){
                if(data.data.img[j].title == favs[int].title && data.data.img[j].url == favs[int].url && favs[int].type == "img"){
                  data.data.img[j].fav = true;
                }
              }
              for(var k = 0; k < data.data.video.length; k++){
                if(data.data.video[k].title == favs[int].title && data.data.video[k].url == favs[int].url && favs[int].type == "vid"){
                  data.data.video[k].fav = true;
                }
              }
              for(var l = 0; l < data.data.doc.length; l++){ 
                if(data.data.doc[l].title == favs[int].title && data.data.doc[l].url == favs[int].url && favs[int].type == "doc"){
                  data.data.doc[l].fav = true;
                }
              }
              for(var m = 0; m < data.data.system.length; m++){ 
                if(data.data.system[m].ID == favs[int].ID && favs[int].type == "system"){
                  data.data.system[m].fav = true;
                }
              }
              for(var n = 0; n < data.data.set.length; n++){ 
                if(data.data.set[n].ID == favs[int].ID && favs[int].type == "set"){
                  data.data.set[n].fav = true;
                }
              }
              for(var o = 0; o < data.data.part.length; o++){ 
                if(data.data.part[o].ID == favs[int].ID && favs[int].type == "part"){
                  data.data.part[o].fav = true;
                }
              }
            }
            console.log(data.data);
            that.key = data.data;
            that.key.system = data.data.system;
            that.key.doc = data.data.doc;
            that.key.img = data.data.img;
            that.key.video = data.data.video;
            that.key.technique = [];
            that.key.set = data.data.set;
            that.key.part = data.data.part;
            that.listItem = data.data.system;
            this.templist = this.listItem;
            that.systemlen = data.data.system.length;
            that.doclen = data.data.doc.length;
            that.imglen = data.data.img.length;
            that.vidlen = data.data.video.length;
            that.partlen = data.data.part.length;
            that.setlen = data.data.set.length;
            that.setTab('systemtab');
          })
          .catch((err) => console.error(err));
          
        })
        .catch((err)=> console.log(err));

      }
      // else{
      //   if(data.data.length && this.type != "technique")
      //     _.each(data.data, function(element, i){
      //         if(element.img.length){
      //           element["url"] = element.img[0].url;
      //         }
      //     });
      //   this.listItem = data.data;
      //   switch(this.type){
      //     case 'part':
      //       this.setTab('parttab');
      //       this.partlen = data.data.length;
      //     break;
      //     case 'set':
      //       this.setTab('settab');
      //       this.setlen = data.data.length;
      //     break;
      //     case 'system':
      //       this.setTab('systemtab');
      //       this.systemlen = data.data.length;
      //     break;
      //     case 'technique':
      //       this.setTab('techtab');
      //       this.techlen = data.data.length;
      //     break;
      //   }
      // }
    }
    else if(data.length){
      console.log(1);
      if(this.type != "technique")
      this.g.findQSSL(this.g.db.fav, {fav: true, type: this.type}, { type: 1 }, 0, 0)
      .then((favs: any) => {
        console.log("Favorites", favs)
        for(var int = 0; int < favs.length; int++){
          for(var j = 0; j < data.length; j++){
            if(data[j].ID == favs[int].ID && data[j].Name == favs[int].Name){
              data[j].fav = true;
            }
          }
        }
        this.listItem = data;
        this.templist = this.listItem;
      })
      .catch((err) => console.error(err));
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
          this.setTab('systemtab');
          this.systemlen = data.length;
        break;
        case 'technique':
          this.setTab('techtab');
          this.listItem = data;
          this.templist = this.listItem;
          this.techlen = data.length;
        break;
      }
    }
    else{
      console.log(2)
      this.listItem = [];
      this.templist = this.listItem;
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
            this.setTab('systemtab');
            this.systemlen = 0;
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
      this.setTab('systemtab');
      this.type = 'system';
      var vector = {};
      vector[this.g.Lang + '.technique.technique_id'] = {$in: [item.id]}
      console.log("Vector", vector);
      this.g.findQSSL(this.g.db.system, { $or: [{"technique.technique_id": {$in: [item.id]}}, vector], voidfl : {$ne : 'Y'} },{ system_nm: 1}, 0, 0)
        .then((docs: any) => {
            console.log(docs);
            var len = docs.length;
            if(len){
              _.each(docs, (element, i)=>{
                if(element[that.g.Lang]){
                  for(var key in element[that.g.Lang]){
                    element[key] = element[that.g.Lang][key];
                  }
                }
                element["Name"] = element.system_nm;
                element["ID"] = element.system_id;
                if(element.img.length){
                  element["url"] = element.img[0].url;
                }
                if(i == (len-1)){
                  that.listItem = docs;
                  this.templist = this.listItem;
                  that.systemlen = docs.length;
                }
              });
            }
            else{
              that.listItem = [];
              this.templist = this.listItem;
              that.systemlen = 0;
            }
            
          }) // here you will get it
          .catch((err) => console.error(err));
    }
    else if(this.type == "key" && (this.tabs.doctab || this.tabs.imgtab || this.tabs.vidtab)){
      // Do not remove this condition
    }
    else {

      let typ = this.type;
      if(typ == "key"){
        // selected Tab
        if(this.tabs.systemtab){
          typ = 'system';
        }
        else if(this.tabs.parttab){
          typ = 'part';
        }
        else if(this.tabs.settab){
          typ = 'set';
        }
      }
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

  

  showFavs(){
    this.type = "fav";
    this.tab = true;
    this.nomedia = true;
    this.setMainTab('fav');
    this.g.findQSSL(this.g.db.fav, {accountID: localStorage.getItem('email'), fav: true}, {type: -1}, 0, 0)
      .then((docs: any) => {
        console.log(docs);
        this.listItem = [];
        this.templist = this.listItem;
        this.fav.system = _.filter(docs, (v) => { return v.type == 'system' });
        this.fav.doc = _.filter(docs, (v) => { return v.type == 'doc' });
        this.fav.img = _.filter(docs, (v) => { return v.type == 'img' });
        this.fav.video = _.filter(docs, (v) => { return v.type == 'vid' });
        this.fav.set = _.filter(docs, (v) => { return v.type == 'set' });
        this.fav.part = _.filter(docs, (v) => { return v.type == 'part' });
        this.listItem = this.fav.system;
        this.templist = this.listItem;
        this.systemlen = this.fav.system.length;
        this.doclen = this.fav.doc.length;
        this.imglen = this.fav.img.length;
        this.vidlen = this.fav.video.length;
        this.partlen = this.fav.part.length;
        this.setlen = this.fav.set.length;
        this.setTab('systemtab');
      }) // here you will get it
      .catch((err) => console.error(err));
  }
  
  showRecents(){
    this.type = "rec";
    this.tab = true;
    this.nomedia = true;
    this.setMainTab('rec');
    this.g.findQSSL(this.g.db.recent, {accountID: localStorage.getItem('email')}, {time: -1, type: 1}, 0, 0)
      .then((docs: any) => {
        console.log(docs);
        this.g.findQSSL(this.g.db.fav, {fav: true}, { type: 1 }, 0, 0)
        .then((favs: any) => {
          console.log("Favorites", favs);
          this.listItem = [];
          this.templist = this.listItem;
          this.rec.system = _.filter(docs, (v) => { return v.type == 'system' });
          // this.rec.system = _.sortBy(this.rec.system, 'Name');
          this.rec.doc = _.filter(docs, (v) => { return v.type == 'doc' });
          this.rec.img = _.filter(docs, (v) => { return v.type == 'img' });
          this.rec.video = _.filter(docs, (v) => { return v.type == 'vid' });
          this.rec.set = _.filter(docs, (v) => { return v.type == 'set' });
          this.rec.part = _.filter(docs, (v) => { return v.type == 'part' });
          for(var int = 0; int < favs.length; int++){
            for(var j = 0; j < this.rec.img.length; j++){
              if(this.rec.img[j].title == favs[int].title && this.rec.img[j].url == favs[int].url && favs[int].type == "img"){
                this.rec.img[j].fav = true;
              }
            }
            for(var k = 0; k < this.rec.video.length; k++){
              if(this.rec.video[k].title == favs[int].title && this.rec.video[k].url == favs[int].url && favs[int].type == "vid"){
                this.rec.video[k].fav = true;
              }
            }
            for(var l = 0; l < this.rec.doc.length; l++){ 
              if(this.rec.doc[l].title == favs[int].title && this.rec.doc[l].url == favs[int].url && favs[int].type == "doc"){
                this.rec.doc[l].fav = true;
              }
            }
            for(var m = 0; m < this.rec.system.length; m++){ 
              if(this.rec.system[m].ID == favs[int].ID && favs[int].type == "system"){
                this.rec.system[m].fav = true;
              }
            }
            for(var n = 0; n < this.rec.set.length; n++){ 
              if(this.rec.set[n].ID == favs[int].ID && favs[int].type == "set"){
                this.rec.set[n].fav = true;
              }
            }
            for(var o = 0; o < this.rec.part.length; o++){ 
              if(this.rec.part[o].ID == favs[int].ID && favs[int].type == "part"){
                this.rec.part[o].fav = true;
              }
            }
          }
          
          this.listItem = this.rec.system;
          this.templist = this.listItem;
          this.systemlen = this.rec.system.length;
          this.doclen = this.rec.doc.length;
          this.imglen = this.rec.img.length;
          this.vidlen = this.rec.video.length;
          this.partlen = this.rec.part.length;
          this.setlen = this.rec.set.length;
          this.setTab('systemtab');
        }) // here you will get it
        .catch((err) => console.error(err));
      }) // here you will get it
      .catch((err) => console.error(err));
  }

  setFavorite(item: any, index: number){
    console.log(item);
    console.log(index);
    var selTab = '', type = '', query = {};
    for(var key in this.tabs){
      if(this.tabs[key] === true)
      selTab = key
    }
    console.log(selTab);
    type = selTab.replace('tab', '');
    console.log(type);
    if(this.nomedia){
      query = {accountID: localStorage.getItem('email'), ID: (item.ID) ? item.ID : item[type + '_id'], Name: (item.Name) ? item.Name : item[type + '_nm'], type: type, url: (item && item.img && item.img.length) ?  item.img[0].url : (item.url)? item.url: ''}
    }
    else{
      query = {accountID: localStorage.getItem('email'), title: item.title, type: type, url: item.url }
    }
    console.log(query);
    if(item.fav === undefined){
      item.fav = false;
    }
    console.log(!item.fav)
    this.g.upsertQ(this.g.db.fav, query, {$set: { fav : !item.fav}}, (rst) => {
      console.log(rst);
      if(rst){
        item.fav = !item.fav;
        this.listItem[index].fav = item.fav;
        this.templist = this.listItem;
        if(this.type == "fav"&& !item.fav){
          this.listItem = _.filter(this.listItem, (v, i) => { return i != index });
          this.templist = this.listItem;
          this[type + 'len'] -= 1; 
        }
        this.hc.setMsg((item.fav) ? 20000003 : 20000004);
      }
    })
  }

  selectTab(val: any, tab: any){
    console.log(val);
    if(val == 'doc' || val == 'img' || val == 'video'){
      this.nomedia = false;
    }
    else{
      this.nomedia = true;
    }

    if(this.type == "key" || this.type == "fav" || this.type == "rec"){
      this.listItem = this[this.type][val];
      this.templist = this.listItem;
    }
    console.log(this.listItem)
    this.setTab(tab);

  }

  onChange(val: any){
    console.log(val);
    this.type = val;
    this.seltype = val;
    this.tab = false;
    this.listItem = [];
    this.templist = this.listItem;
    this.display = false;
    this.txt = "";
    this.nomedia = true;
    this.setMainTab('');
  }

  viewMedia(item : any, index: number){
    console.log(item);
    // console.log(this.g.file.dataDirectory  + 'www/'+ url);
    this.g.iab.create(this.g.Network===true ? this.g.server + item.url : this.g.file.dataDirectory + 'ProficientTS Test Folder/' + item.url, '_system');
    // if(this.tabs.doctab){
    //   this.g.document.viewDocument(this.g.file.dataDirectory + 'ProficientTS Test Folder/' + url, 'application/pdf', this.g.docVOptions, undefined, undefined, undefined, (err) => {
    //     console.log(err);
    //     this.g.iab.create(this.g.server + url, '_system');
    //   })
    // }
    // else if(this.tabs.imgtab){
    //   let path: any = url.split('/');
    //   path.pop();
    //   path = path.join('/');
    //   let filenm = url.split('/')[(url.split('/').length - 1)]
    //   console.log("Image ----------")
    //   console.log(path);
    //   console.log(filenm);
    //   this.g.file.readAsDataURL(this.g.file.dataDirectory + 'ProficientTS Test Folder/' + path, filenm)
    //   .then((dataURL:string) => { 
    //     console.log("dataURL -------------");
    //     // console.log(dataURL);
    //     this.g.photoViewer.show(dataURL)
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //     this.g.iab.create(this.g.server + url);
    //   })
    // }
    // else if(this.tabs.vidtab){
    //   console.log("view")
    //   this.hc.playVideo(url);
    // }
    var type = '';
    for(var key in this.tabs){
      if(this.tabs[key] === true)
      type = key
    }
    console.log(type);
    type = type.replace('tab', '');
    this.g.upsertQ(this.g.db.recent, {accountID: localStorage.getItem('email'), title: item.title, type: type, url: item.url }, {$set: {time: Number(new Date())}}, function(rst){
      console.log(rst);
    });
    if(this.type == "rec"){
      var arr1 = _.filter(this.listItem, (v, i) => { return i == index});
      var arr2 = _.filter(this.listItem, (v, i) => { return i != index});
      this.listItem = arr1.concat(arr2);
      this.templist = this.listItem;
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
    this.g.upsertQ(this.g.db.share, {accountID: localStorage.getItem('email'), type: typ, url: item.url, title: item.title }, {$set: {share: share}}, (rst)=>{
      console.log(rst);
      if(rst){
        that.listItem[index].share = share;
        this.templist = this.listItem;
        that.headerIpt.shareCnt = (share) ? ++that.headerIpt.shareCnt : --that.headerIpt.shareCnt;
      }
    });
  }

  searchFilter(){
    if(this.srhtxt.length > 2){
      let searchKeys = [];
      if(this.tabs.parttab){
        searchKeys = ['part_id', 'part_nm'];
      }
      else if(this.tabs.settab){
        searchKeys = ['set_id', 'set_nm'];
      }
      else if(this.tabs.systemtab){
        searchKeys = ['system_id', 'system_nm', 'technique'];
      } 
      this.listItem = _.filter(this.templist, (v, i) => {
        let searchTxt = "";
        for(var key in v){
          if(_.contains(searchKeys, key)){
            if(key == "technique"){
              for(var k =0; k< v[key].length; k++){
                searchTxt = searchTxt + " " + v[key][k].technique_nm.toString().toLowerCase();
              }
            }
            else{
              searchTxt = searchTxt + " " + v[key].toString().toLowerCase();
            }
          }
        }
        console.log(searchTxt)
        let exp = this.srhtxt.toLowerCase();
        return searchTxt.indexOf(exp) !=-1;
      });
      console.log(this.listItem);
    }
    else{
      this.listItem = this.templist;
    }
  }

}
