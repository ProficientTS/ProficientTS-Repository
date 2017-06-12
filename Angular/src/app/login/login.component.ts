import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../resource.service';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'pts-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent implements OnInit {
  headConfig = {
                head: false
             };
auth: string;
login = true;
email = ''; pwd = ''; cpwd = '';
inp = false;
resend = false;
msg = '';
signupmsg = '';
signupmail = '';
  constructor(
    private rs: ResourceService,
    private router: Router,
    private ms: MainService,
    private gs: GlobalService) {
    this.auth = localStorage.getItem('token');
    console.log('Login Token Check: ' + this.auth);
    if (this.auth != null) {
      this.router.navigate(['/home']);
    }
   }

  ngOnInit() {
    this.ms.header.emit(this.headConfig);
  }

  fnsignin(email, pwd) {
    if(email && pwd) {
        this.rs.signin(email, pwd).subscribe(posts => {
            console.log(posts);
            this.fnhandlesignin(posts);
        },
        err => {
            console.log('Data Error')
        });

    }
  }

  fnhandlesignin(data) {
    console.log(data.success);
    if (data.success) {
      localStorage.setItem('token', data.token);
      // localStorage.setItem(, data.token);
      this.router.navigate(['/home']);
    }
    else{
      this.msg = data.msg;
    }

  }

  fnchkUserbyKey(e, email, pwd) {
    if(e.keyCode === 13){  // 13 is Enter KeyCode
      this.fnsignin(email, pwd);
    }
  }

  fnSignUp(resend) {
      this.rs.fnemailVerification({
        email: this.email,
        password: this.pwd
      }).subscribe(user => {
        console.log(user);
        this.fnemailVerify(user, resend);
      },
      err => {
        console.log(err);
      })
  }

  fnemailVerify(data, resend) {
    if (data.success) {
      this.resend = true; this.inp = true; this.signupmsg = '';
      this.signupmail = data.msg;
      this.gs.data = data.temptoken;
      // localStorage.setItem('token', data.token);
      this.router.navigate(['/loginconfirmation']);
    } else {
      if(data.success == false){
        if(resend)
          this.router.navigate(['/home']);
      }
      this.email = ''; this.pwd = ''; this.cpwd = '';
      this.signupmsg = data.msg;
    }
  }

  fnBackTologinPage(){

    this.login = true; 
    this.resend = false;
    this.inp = false; 
    this.email = ''; 
    this.pwd = ''; 
    this.cpwd = ''; 
    this.msg = '';
    this.signupmsg = '';

    if(localStorage.getItem('token')!=null)
      this.router.navigate(['/home']);
  }

  fnfrgtPwd() {
    this.router.navigate(['/forgotpwd']);
  }

}
