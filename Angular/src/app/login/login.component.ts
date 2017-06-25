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
    console.log(data);
    if (data.success) {
      localStorage.setItem('token', data.token);
      console.log(data.data[0].email.split('@')[0])
      localStorage.setItem('email', data.data[0].email);
      localStorage.setItem('user', data.data[0].email.split('@')[0]);
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

  fnSignUp() {
    if(this.email != '' && this.pwd != '' && this.cpwd != ''){
      if(this.pwd == this.cpwd){
        this.rs.fnemailVerification({
          email: this.email,
          password: this.pwd
        }).subscribe(user => {
          console.log(user);
          this.fnemailVerify(user);
        },
        err => {
          console.log(err);
        })
    }
    else{
      this.signupmsg = 'Password and Confirm Password must match!';
    }
  }
  else{
    this.signupmsg = 'Please provide all Requisites!';
  }
      
  }

  fnemailVerify(data) {
    console.log(data)
    if (data.success) {
      this.inp = true; this.signupmsg = '';
      this.signupmail = data.msg;
      console.log(this.gs.data);
      this.gs.data.token = data.token;
      this.gs.data.email = data.data.email;
      this.router.navigate(['/loginconfirmation/' + data.data.email + '/' + data.token]);
    } else {
      this.email = ''; this.pwd = ''; this.cpwd = '';
      this.signupmsg = data.msg;
    }
  }

  fnBackTologinPage(){

    this.login = true; 
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
