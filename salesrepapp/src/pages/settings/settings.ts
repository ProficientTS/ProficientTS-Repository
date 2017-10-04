import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';

import { Global } from '../../providers/global';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
headerIpt = {
  // catalogfacility: true,
  shareCnt: 0,
  title: "Settings"
}
  constructor(public navCtrl: NavController,
  private ws: WebserviceProvider,
  private g: Global) {

  }

  freshsync(){
    var that = this;
    that.g.db.devicesync.find({email: localStorage.getItem('email'), deviceID: this.g.deviceId, voidfl : {$ne : 'Y'}}, function(err, doc){
      console.log(err);
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

  getupdates(){
    var that = this;
    that.g.db.devicesync.find({email: localStorage.getItem('email'), deviceID: this.g.deviceId, voidfl : {$ne : 'Y'}}, function(err, doc){
      console.log(err);
      console.log(doc);
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
                  db.share.remove({}, { multi: true }, function (err, numRemoved) {
                    if(err)
                      console.log("Share Reset Failed");
                    else{
                      console.log("Share Reset Successful");
                      console.log(numRemoved);
                    }
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
    }
    else{
      console.log("No updates for now!")
    }
  }
   
  logOut(){
    console.log("logOut ========")
    localStorage.clear();
    this.navCtrl.popToRoot();
  }

}
