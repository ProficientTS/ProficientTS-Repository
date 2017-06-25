import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'pts-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css']
})
export class ResetpwdComponent implements OnInit {
  headConfig = {
                title: 'Reset Password',
                userpic: true
             };
msg = '';
epwd =  '';
pwd =  '';
cpwd =  ''; 
  constructor(private ms: MainService, private rs: ResourceService) { }

  ngOnInit() {
    this.ms.header.emit(this.headConfig);
  }

  fnResetPwd(){
    if(this.epwd != '' && this.pwd != '' && this.cpwd != ''){
      if(this.cpwd != this.pwd){
        this.msg = 'New Password and Confirm Password must match!';
      }
      else{
        this.rs.fnResetPwd({
        email: localStorage.getItem('email'),
        password: this.epwd,
        pwd: this.pwd
      }).subscribe(user => {
        console.log(user);
        this.msg = user.msg;
        if(user.success){
          this.epwd = '';
          this.pwd = '';
          this.cpwd = '';
        }
      },
      err => {
        console.log(err);
      })
      }
    }
    else{
      this.msg = 'Provide all requisites!';
    }
  }

}
