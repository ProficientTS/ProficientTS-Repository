import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductTabPage } from '../catalog/producttab/producttab';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { PartDetailPage } from '../catalog/partdetail/partdetail';
import { SetDetailPage } from '../catalog/setdetail/setdetail';

import { Global } from '../../providers/global';

@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html',
})
export class CatalogPage {
listItem = [];
display: boolean = false;
type = "";
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider,
  private g: Global) {
     console.log(Nedb);
     console.dir(Nedb);
     console.log(this.g.deviceId)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CatalogPage');
  }

  showProduct() {
    this.type = "system";
    this.display = true;
    this.ws.postCall('list/system', {})
    .then(data => {
      this.searchData(data);
    });
    // this.ws.postCall('display/system/207.35', {})
    // .then(data => {
    //   this.handleData(data);
    // });
  }

  showTechniques() {
    this.display = true;
    this.type = "technique";
    this.ws.postCall('list/technique', {})
    .then(data => {
      this.searchData(data);
    });
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
        case "technique":
        case "system":
          this.navCtrl.push(ProductTabPage, {
            data: data.data,
            type: this.type
          });
          break;
      }
      
    }   
  }

  // handleData(data: any){
  //   if(data.success){
  //     this.navCtrl.push(ProductTabPage, {
  //       data: data.data,
  //       type: this.type
  //     });
  //   }   
  // }

  searchItem(v: any, s: any){
    console.log(v);
    console.log(s)
    if(v.length >= 3){
      this.display = true;
      this.type = s;
      this.ws.postCall('list/' + s + '/name/' + v, {})
      .then(data => {
        this.searchData(data);
      });
    }
    else{
      this.listItem = [];
    }
  }

  searchData(data: any){
    console.log(data);
    if(data.data.length){
      this.listItem = data.data;
    }
    else{
      this.listItem = [];
    }
    // this.listItem = data;
  }

  itemTapped(item) {
    console.log(item)
    console.log(this.type)

    if(this.type === "technique" && item.Name === undefined){
      this.ws.postCall('list/'+this.type+'/'+ item.ID + '/system' , {})
      .then(data => {
        this.setData(data);
      });
    }
    else if(this.type === "technique" && item.Name !== undefined){
      this.ws.postCall('display/system/'+ item.ID, {})
      .then(data => {
        this.handleData(data);
      });
    }
    else{
      this.ws.postCall('display/'+this.type+'/'+ item.ID, {})
      .then(data => {
        this.handleData(data);
      });
    }

  }

  setData(data: any){
    console.log(data.data)
    this.listItem = data.data;
  }

  freshsync(){
    var that = this;
    that.g.db.devicesync.find({email: localStorage.getItem('email'), deviceID: this.g.deviceId}, function(err, doc){
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
    that.g.db.devicesync.find({email: localStorage.getItem('email'), deviceID: this.g.deviceId}, function(err, doc){
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
          db.part.update({_id: data.data.part[i]['_id']},data.data.part[i], {upsert: true}, function(err, numReplaced, upsert){
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

}
