import { Injectable, OnDestroy } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import * as _ from 'underscore';

//...loading up plugins
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File, DirectoryEntry } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { TranslateService } from '@ngx-translate/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
  Generated class for the WebserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class Global implements OnDestroy{

db: any;
deviceId: any;
Network: any;
disconnectSubscription: any;
connectSubscription: any;
docVOptions: DocumentViewerOptions = {
  title: 'Proficient Documents'
};
Lang: any = "en";
fileTransfer: FileTransferObject;
totalFileCnt: any = 0;
// fileData: any = [];
fileCnt: any = 0;
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
  }

  constructor(
    public platform: Platform,
    public uid: UniqueDeviceID,
    public network: Network,
    public document: DocumentViewer,
    public photoViewer: PhotoViewer,
    public file: File,
    public transfer: FileTransfer,
    public translate: TranslateService) {
    console.log('Hello Global Provider');
    console.log(Nedb);
    this.Network = this.network.type;
    translate.setDefaultLang('de');
    this.Lang = 'de';
    this.fileTransfer = transfer.create();
    this.db = {};
    this.db.user = new Nedb({filename: './assets/database/user.db', autoload: true});
    this.db.part = new Nedb({filename: './assets/database/part.db', autoload: true});
    this.db.set = new Nedb({filename: './assets/database/set.db', autoload: true});
    this.db.system = new Nedb({filename: './assets/database/system.db', autoload: true});
    this.db.technique = new Nedb({filename: './assets/database/technique.db', autoload: true});
    this.db.file = new Nedb({filename: './assets/database/file.db', autoload: true});
    this.db.devicesync = new Nedb({filename: './assets/database/devicesync.db', autoload: true});
    this.db.fav = new Nedb({filename: './assets/database/favorites.db', autoload: true});
    this.db.recent = new Nedb({filename: './assets/database/recent.db', autoload: true});
    this.db.share = new Nedb({filename: './assets/database/share.db', autoload: true});
    
    this.uid.get()
    .then((uuid: any) => {console.log(uuid); this.deviceId = uuid;})
    .catch((error: any) => this.deviceId = 'APP_ID_NO_CORDOVA');
    console.log(this.network)
    console.log(this.network.type)

    // watch network for a disconnect
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.Network = null;
    });


    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
          this.Network = this.network.type;
          console.log('we got a net connection, woohoo!');
          console.log(this.Network)
      }, 3000);
    });

  }

  getData(query: any) {
    // console.log(fn);
    return new Promise((resolve, reject) => {
        this.db.system.find( query, function(err, docs) {
            if(err) reject(err);
            resolve(docs);
        });
    })
  }

  findQ(db: any, query: object){
    return new Promise((resolve, reject) => {
        db.find( query, function(err, docs) {
            if(err) reject(err);
            resolve(docs);
        });
    })
  }
  
  findQSSL(db: any, query: object, srt: object, skp: any, lmt: any){
    return new Promise((resolve, reject) => {
        db.find(query).sort(srt).skip(skp).limit(lmt).exec(function(err, docs) {
          console.log(docs)
            if(err) reject(err);
            resolve(docs);
        });
    })
  }

  upsertQ(db: any, query: object, update: object, callback: any){
    let upsertPromise = new Promise((resolve, reject) => {
        db.update( query, update, { upsert: true }, function(err, numReplaced, upsert) {
            if(err) reject(err);
            resolve(upsert);
        });
    });
    upsertPromise
      .then((data: any) => {
        console.log("upsertPromise Success Data --------")
        console.log(data);
        callback(true);
      })
      .catch((err: any) => {
        console.log("upsertPromise Err -----------------")
        console.log(err)
        callback(false);
      })
  }

  insertQ(db: any, query: object, callback: any){
    let insertPromise = new Promise((resolve, reject) => {
        db.insert( query, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });
    insertPromise
      .then((data: any) => {
        console.log("insertPromise Success Data --------")
        console.log(data);
        callback(true, data);
      })
      .catch((err: any) => {
        console.log("insertPromise Err -----------------")
        console.log(err)
        callback(false);
      })
  }

  removeQ(db: any, query: object, callback: any){
    let removePromise = new Promise((resolve, reject) => {
        db.remove(query, {multi: true}, (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
    removePromise
      .then((data: any) => {
        console.log("removePromise Success Data --------")
        console.log(data);
        callback(true, data);
      })
      .catch((err: any) => {
        console.log("removePromise Err -----------------")
        console.log(err)
        callback(false);
      })
  }

  FileSync() {
    this.file.resolveDirectoryUrl(this.file.dataDirectory)
      .then((directoryEntry: DirectoryEntry) => {
        console.log("Directory entry created")
        console.log(directoryEntry);
        this.file.getDirectory(directoryEntry, 'ProficientTS Test Folder', { create: true })
        .then((dir: any) => {
          console.log("Directory created successfully")
          console.log(dir);
          this.primaryFileSync();
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

  primaryFileSync(){
    this.totalFileCnt = 0;
    this.fileCnt = 0;
    this.findQSSL(this.db.file, {voidfl : {$ne : 'Y'}, "file_type": "img", "primary": "Y"}, {"url": 1}, 0, 0)
      .then((doc: any) => {
        console.log(doc);
        console.log(doc.length);
        this.totalFileCnt = doc.length;
        if(doc.length){
          _.each(doc, (file) => {
            this.download(file.url, () => {
              console.log("Primary Files Download Complete");
              this.otherSystemFileSync();
            });
          });
        }
        else{
          this.otherSystemFileSync();
        }
      });
  }

  otherSystemFileSync(){
    this.totalFileCnt = 0;
    this.fileCnt = 0;
    this.findQSSL(this.db.file, {voidfl : {$ne : 'Y'}, "primary": {$ne : 'Y'}, url: { $regex: new RegExp( 'system/')}}, {"url": 1}, 0, 0)
      .then((doc: any) => {
        console.log(doc);
        console.log(doc.length);
        this.totalFileCnt = doc.length;
        if(doc.length){
          _.each(doc, (file) => {
            this.download(file.url, () => {
              console.log("Remaining System Files Download Complete");
            });
          });
        }
        else{
          this.otherRemainingFileSync();
        }
      });
  }

  otherRemainingFileSync() {
    this.totalFileCnt = 0;
    this.fileCnt = 0;
    this.findQSSL(this.db.file, {voidfl : {$ne : 'Y'}, "primary": {$ne : 'Y'}, url: {$ne: { $regex: new RegExp( 'system/')}}}, {"url": 1}, 0, 0)
      .then((doc: any) => {
        console.log(doc);
        console.log(doc.length);
        this.totalFileCnt = doc.length;
        if(doc.length){
          _.each(doc, (file) => {
            this.download(file.url, () => {
              console.log("Remaining Files Download Complete");
            });
          });
        }
        else{
          console.log("Remaining Files Download Complete");
        }
      });
  }

  download(path: any, callback: any) {
    // console.log(path);
    console.log(this.file.dataDirectory)
    const url = 'http://192.169.169.6:3000/filesystem/' + path;
    this.fileTransfer.download(encodeURI(url), this.file.dataDirectory + 'ProficientTS Test Folder/' + path).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.complete(callback);
    }, (error) => {
      // handle error
      console.log(error)
      this.complete(callback);
    });

  }

  complete(callback: any){
    ++this.fileCnt;
    if(this.totalFileCnt == this.fileCnt){
      this.totalFileCnt = 0;
      this.fileCnt = 0;
      if(callback)
        callback()
    }
    
  }

  // abortDownload() {
  //   this.fileData = [];
  //   this.fileTransfer.abort();
  //   this.totalFileCnt = 0;
  //   this.fileCnt = 0;
  //   console.log("Abort Download")
  // }

  validations(){
    return [
              {
                  "code": 10000002,
                  "En": "Initial Sync Setup",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 20000002,
                  "En": "Initial Sync Setup Completed",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 20000003,
                  "En": "Marked as a favorite",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 20000004,
                  "En": "Removed from favorites",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 20000007,
                  "En": "Mail Sent Successfully",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 50000002,
                  "En": "Provide a To address to send mail",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 50000003,
                  "En": "Failed to send mail",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 20000006,
                  "En": "App Data Reset Successful",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 50000004,
                  "En": "File not yet downloaded!",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 20000009,
                  "En": "We have Internet Connection!",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 50000005,
                  "En": "We Lost Internet Connection!",
                  "Frn": "",
                  "Dut": ""
              },
              {
                  "code": 50000006,
                  "En": "Internet Connection is Required!",
                  "Frn": "",
                  "Dut": ""
              }
          ];
  }

}
