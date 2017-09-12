import { Injectable } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
  Generated class for the WebserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class Global {

db: any;
deviceId: any;
// user: any;
// part: any;
// set: any;
// system: any;
// technique: any;

  constructor(private uid: UniqueDeviceID) {
    console.log('Hello Global Provider');
    console.log(Nedb);
    this.db = {};
    this.db.user = new Nedb({filename: 'assets/database/user.db', autoload: true});
    this.db.part = new Nedb({filename: 'assets/database/part.db', autoload: true});
    this.db.set = new Nedb({filename: 'assets/database/set.db', autoload: true});
    this.db.system = new Nedb({filename: 'assets/database/system.db', autoload: true});
    this.db.technique = new Nedb({filename: 'assets/database/technique.db', autoload: true});
    this.db.mastersync = new Nedb({filename: 'assets/database/mastersync.db', autoload: true});
    this.db.devicesync = new Nedb({filename: 'assets/database/devicesync.db', autoload: true});
    this.uid.get()
    .then((uuid: any) => {console.log(uuid); this.deviceId = uuid;})
    .catch((error: any) => this.deviceId = 'APP_ID_NO_CORDOVA');
  }

  

}
