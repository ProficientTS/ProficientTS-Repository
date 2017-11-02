import { Component, ViewChild } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';

import { Global } from '../../providers/global';
import * as _ from 'underscore';
import { LoginPage } from '../login/login';
import { HeaderComponent } from '../header/header.component';
import { DirectoryEntry } from '@ionic-native/file';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  @ViewChild(HeaderComponent) hc: HeaderComponent;
headerIpt = {
  // catalogfacility: true,
  shareCnt: 0,
  title: "Settings"
};
lang = [
    {
      val: 'de',
      desc: 'Deutsch'
    },
    {
      val: 'en',
      desc: 'English'
    },
    {
      val: 'es',
      desc: 'Español'
    }
  ];
  constructor(public navCtrl: NavController,
  private ws: WebserviceProvider,
  private g: Global,
  private app: App,) {
  }

  downloadFiles(){
    var that = this;
    this.g.totalFileCnt = 0;
    this.g.fileCnt = 0;
    this.g.file.resolveDirectoryUrl(this.g.file.dataDirectory)
      .then((directoryEntry: DirectoryEntry) => {
        console.log("Directory entry created")
        console.log(directoryEntry);
        this.g.file.getDirectory(directoryEntry, 'ProficientTS Test Folder', { create: true })
        .then((dir: any) => {
          console.log("Directory created successfully")
          console.log(dir);
          this.g.findQSSL(this.g.db.file, {voidfl : {$ne : 'Y'}}, {"file_type": 1}, 0, 0)
          .then((doc: any) => {
            console.log(doc);
            this.g.totalFileCnt = doc.length;
            if(doc.length){
              _.each(doc, (file) => {
                this.g.download(file.url, () => {
                  console.log("All Files Download Complete");
                });
              });
            }
            else{
              console.log("No Files to Download!")
            }
          })
          .catch((err: any) => {
            console.log("Error fetching File DB")
            console.log("Create Directory 1st")
            console.log(err);
          });
        })
        .catch((direrr: any) => {
          console.log("Error Creating Directory")
          console.log(direrr)
        })
      })
      .catch((err:any) => {
        console.log("Error Creating directory entry");
        console.log(err);
      });
  }

  // createdir(){
  //   console.log("Test Folder name: ProficientTS Test Folder");
  //   console.log("This is the platform's dataDirectory ----> " + this.g.file.dataDirectory);
  //   this.g.file.resolveDirectoryUrl(this.g.file.dataDirectory)
  //   .then((directoryEntry: DirectoryEntry) => {
  //     console.log("Directory entry created")
  //     console.log(directoryEntry);
  //     this.g.file.getDirectory(directoryEntry, 'ProficientTS Test Folder', { create: true })
  //     .then((dir: any) => {
  //       console.log("Directory created successfully")
  //       console.log(dir);
  //     })
  //     .catch((direrr: any) => {
  //       console.log("Error Creating Directory")
  //       console.log(direrr)
  //     })
  //   })
  //   .catch((err:any) => {
  //     console.log("Error Creating directory entry");
  //     console.log(err)
  //   });
  // }

  // deletedir(){
  //   console.log("Test Folder name: ProficientTS Test Folder");
  //   this.g.file.removeRecursively(this.g.file.dataDirectory, 'ProficientTS Test Folder')
  //       .then((success: any) => {
  //         console.log("Directory Removed");
  //         console.log(success);
  //       })
  //       .catch((err: any) => {
  //         console.log("Error Removing Directory");
  //         console.log(err);
  //       })
  // }

  selectLang(lang: any){
    console.log(lang);
    this.g.translate.use(lang);
    localStorage.setItem('i18n', lang);
    this.g.Lang = lang;
  }

  freshsync(){
    var that = this;
    this.g.findQSSL(this.g.db.devicesync, {}, {deviceID: 1}, 0, 0)
      .then((doc: any) => {
        console.log(doc);
        if(doc.length == 0){
          that.ws.postCall('sync', {email: localStorage.getItem('email'), deviceID: that.g.deviceId})
            .then((data: any) => {
              if(data && data.msg == "InValid Credential"){
                that.logOut();
              }
              else{
                that.syncService(data);
              }
            });
        }
        else{
          console.log("Already Synced!")
        }
      })
      .catch((err: any) => {
        console.log("Error fetching Device Sync DB")
        console.log("Create Directory 1st")
        console.log(err);
      });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter SettingsPage');
  }

    // more performance
  syncService(data: any){
    console.log(data);
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
                this.g.insertQ(this.g.db.devicesync, {fullsync: "Y", email: localStorage.getItem('email'), deviceID: this.g.deviceId}, (devicesyncstatus, devicesync) => {
                  if(devicesyncstatus){
                    console.log("devicesyncs Inserted Successfully");
                    console.log(devicesync);
                  }
                  else{
                    console.log("Insert Failed");
                  }
                  this.hc.msg = "Fresh Sync Completed";
                })
              })
            })
          })
        })
      })
    }
  }

  getupdates(){
    var that = this;
    this.g.findQSSL(this.g.db.devicesync, {}, {deviceID: 1}, 0, 0)
      .then((doc: any) => {
        if(doc.length){
          that.ws.postCall('sync', {email: localStorage.getItem('email'), update: 'Y', deviceID: that.g.deviceId})
          .then((data: any) => {
            if(data && data.msg == "InValid Credential"){
              that.logOut();
            }
            else{
              that.updateService(data);
            }
          });
        }
        else{
          console.log("Fresh Sync First!")
        }
      });

  }

  resetFiles(){
    var db = this.g.db;
    var that = this;
  }

  resetdata(){

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
                          this.hc.setMsg(20000006);
                        })
                        .catch((err: any) => {
                          console.log("Error Removing Directory");
                          console.log(err);
                        })
                      }
                      else{
                        this.hc.setMsg(20000006);
                      }
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
      if(data.data.file.length){
        for(var i = 0; i < data.data.file.length; i++){
          db.file.update({_id: data.data.file[i]['_id']},data.data.file[i], {upsert: true}, function(err, numReplaced, upsert){
            if(err)
              console.log("File Update Failed");
            else{
              console.log("File Update Successfully");
              console.log(numReplaced);
            }
          })
        }
      }
    }
    else{
      console.log("No updates for now!")
    }
  }
   
  logOut(){
    console.log("logOut ========")
    localStorage.removeItem('token');
    this.app.getRootNav().setRoot(LoginPage);
  }

}
