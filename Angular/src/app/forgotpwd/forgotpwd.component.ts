import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { ResourceService } from '../resource.service';
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
msg1 = 'Verifying..........';
email = '';
chkemail = true;
pwd: string;
login = false;

  constructor(
    private ms: MainService,
    private rs: ResourceService,
    private router: Router) {
     }

  ngOnInit() {
    this.ms.header.emit(this.headConfig);
  }

  fnCheckFPUser(){
    this.verified = true;
    this.rs.fnemailFPVerification({
        email: this.email
      }).subscribe(user => {
        console.log(user);
        this.msg1 = user.msg;
        this.login = true;
      },
      err => {
        console.log(err);
      });
  }
  

fnBackTologin(){
  this.router.navigate(['/']);
}

}
