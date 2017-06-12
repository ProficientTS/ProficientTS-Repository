import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { ResourceService } from '../resource.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'pts-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.css']
})
export class ForgotpwdComponent implements OnInit {
headConfig = {
                title: 'Forgot Password',
                userpic: false
             };
verified = false;
msg1 = 'Loading..........';
email = '';
verifiedbymail = false;
fptoken= '';
chkemail = true;
pwd: string;
login = false;

  constructor(
    private ms: MainService,
    private rs: ResourceService,
    private route: ActivatedRoute,
    private router: Router) {
      this.fptoken = this.route.snapshot.params['fptoken']!=null ? this.route.snapshot.params['fptoken'] : '';
     }

  ngOnInit() {
    this.ms.header.emit(this.headConfig);
    if(this.fptoken!=''){
      this.verifiedbymail = true;
      this.chkemail= false;
    }
  }

  fnCheckFPUser(){
    this.verified = true;
    this.rs.fnemailFPVerification({
        email: this.email
      }).subscribe(user => {
        console.log(user);
        this.msg1 = user.msg;
      },
      err => {
        console.log(err);
      });
  }
  fnResetPwd(){
    console.log(this.fptoken);
    if(this.pwd){
      this.rs.fnresetpwd({
        pwd: this.pwd,
        token: this.fptoken
      }).subscribe(user => {
        console.log(user);
        this.msg1 = user.msg;
        this.verified = true;
        this.verifiedbymail = false;
        this.login = true;
      },
      err => {
        console.log(err);
      })
    }
  }

fnBackTologin(){
  this.router.navigate(['/']);
}

}
