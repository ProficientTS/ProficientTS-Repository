import { Injectable } from '@angular/core';
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

    return new Promise(resolve => {
      console.log("urlurlurl ------ "+ url);
      this.http.post('http://192.169.169.6:3000/' + url, obj)
        .map(res => res.json())
        .subscribe(data => {

          resolve(data);

        });
    });
  }

}
