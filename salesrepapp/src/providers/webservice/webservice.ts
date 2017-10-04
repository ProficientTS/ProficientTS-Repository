import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WebserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WebserviceProvider {

  constructor(public http: Http) {
    console.log('Hello WebserviceProvider Provider');
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
          resolve(data);
      });
    });
  }

}
