import { Injectable } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Network } from '@ionic-native/network';
import { OnDestroy } from '@angular/core';
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
// user: any;
// part: any;
// set: any;
// system: any;
// technique: any;

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
  }

  constructor(private uid: UniqueDeviceID, private network: Network) {
    console.log('Hello Global Provider');
    console.log(Nedb);
    this.Network = this.network.type;
    this.db = {};
    this.db.user = new Nedb({filename: 'assets/database/user.db', autoload: true});
    this.db.part = new Nedb({filename: 'assets/database/part.db', autoload: true});
    this.db.set = new Nedb({filename: 'assets/database/set.db', autoload: true});
    this.db.system = new Nedb({filename: 'assets/database/system.db', autoload: true});
    this.db.technique = new Nedb({filename: 'assets/database/technique.db', autoload: true});
    this.db.mastersync = new Nedb({filename: 'assets/database/mastersync.db', autoload: true});
    this.db.devicesync = new Nedb({filename: 'assets/database/devicesync.db', autoload: true});
    this.db.fav = new Nedb({filename: 'assets/database/favorites.db', autoload: true});
    this.db.recent = new Nedb({filename: 'assets/database/recent.db', autoload: true});
    this.db.share = new Nedb({filename: 'assets/database/share.db', autoload: true});
    
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

}
