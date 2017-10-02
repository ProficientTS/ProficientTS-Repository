import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

/*
  Generated class for the WebserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WebserviceProvider {

  constructor(public http: Http, protected injector: Injector) {
    console.log('Hello WebserviceProvider Provider');
  }

  get navCtrl(): NavController {
    return this.injector.get(NavController);
  }

  postCall(url: any, obj: any) {
    var that = this;
    return new Promise(function(resolve, reject){
      console.log("urlurlurl ------ "+ url);
      if(obj.token === undefined || obj.token.length < 1){
        obj['token'] = localStorage.getItem('token');
      }
      that.http.post('http://192.169.169.6:3000/' + url, obj)
      .map(res => res.json())
      .subscribe(data => {
        if(data && data.msg == "InValid Credential")
          that.LogOut();
        else if(data)
          resolve(data);
      });
    });
  }

  LogOut(){
    console.log("LogOut ---------");
    localStorage.clear();
    this.navCtrl.popToRoot();
  }

}
