import { Component, ViewChild } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';

import { Global } from '../../providers/global';
import * as _ from 'underscore';
import { LoginPage } from '../login/login';
import { HeaderComponent } from '../header/header.component';

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
}
  constructor(public navCtrl: NavController,
  private ws: WebserviceProvider,
  private g: Global,
  private app: App,) {
  }

  downloadFiles(){
    var that = this;
    this.g.totalFileCnt = 0;
    this.g.fileCnt = 0;
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
      });
  }

  freshsync(){
    var that = this;
    this.g.findQSSL(this.g.db.devicesync, {email: localStorage.getItem('email'), deviceID: this.g.deviceId, voidfl : {$ne : 'Y'}}, {deviceID: 1}, 0, 0)
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
    this.g.findQSSL(this.g.db.devicesync, {email: localStorage.getItem('email'), deviceID: this.g.deviceId, voidfl : {$ne : 'Y'}}, {deviceID: 1}, 0, 0)
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
    var db = this.g.db;
    var that = this;
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
                  db.share.remove({}, { multi: true }, function (err, numRemoved) {
                    if(err)
                      console.log("Share Reset Failed");
                    else{
                      console.log("Share Reset Successful");
                      console.log(numRemoved);
                    }
                    db.file.remove({}, { multi: true }, function (err, numRemoved) {
                      if(err)
                        console.log("File Reset Failed");
                      else{
                        console.log("File Reset Successful");
                        console.log(numRemoved);
                        if(that.g.platform.is('cordova')){
                          that.g.file.removeRecursively(that.g.file.dataDirectory, 'salesrepapp')
                          .then((success: any) => {
                            console.log("Directory Removed");
                            console.log(success);
                            that.hc.msg = "App Data Reset Successful";
                          })
                          .catch((err: any) => {
                            console.log("Error Removing Directory");
                            console.log(err);
                          })
                        }
                        else{
                          that.hc.msg = "App Data Reset Successful";
                        }
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
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
    localStorage.clear();
    this.app.getRootNav().setRoot(LoginPage);
  }

}
