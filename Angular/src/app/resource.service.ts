import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class ResourceService {

  constructor(private http: Http){
      console.log('Post');
  }

  fnemailVerification(obj: any) {
    console.log('chkUser' + obj.email + ' ' + obj.password);
      return this.http.post('http://localhost:777/signup', {
          email: obj.email,
          password: obj.password
      })
      .map(res => res.json())
  }

  fnemailFPVerification(obj: any) {
    console.log('chkUser' + obj.email );
      return this.http.post('http://localhost:777/checkfpuser', {
          email: obj.email
      })
      .map(res => res.json())
  }

  getPosts() {
        return this.http.get('http://localhost:777/')
        .map(res => res.json())
    }

    saveUserSignUp (obj: any) {
        return this.http.post('http://localhost:777/secure-api/saveUserSignUp', {
          token: obj.token
      })

      .map(res => res.json())
    }

    signin(email: any, pwd: any) {
        return this.http.post('http://localhost:777/auth', {
          email: email,
          password: pwd
      })
      .map(res => res.json())
    }

    fnresetpwd(obj: any) {
        return this.http.post('http://localhost:777/secure-api/resetpwd', {
          token: obj.token,
          pwd: obj.pwd
      })

      .map(res => res.json())
    }
    uservalidation(obj: any) {
        return this.http.post('http://localhost:777/secure-api/uservalidation', {
          token: obj.token
      })

      .map(res => res.json())
    }

    getList(obj: any) {
        console.log(obj)
        return this.http.post('http://localhost:777/list', obj)

      .map(res => res.json())
    }
}
