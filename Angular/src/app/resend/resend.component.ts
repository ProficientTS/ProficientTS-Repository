import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';
import { ResourceService } from '../resource.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pts-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.css']
})
export class ResendComponent implements OnInit {
  msg = '';
token = "";
email = '';
  constructor(private gs: GlobalService,
  private router: Router,
  private rs: ResourceService,
  private route: ActivatedRoute) { 
    this.email = this.route.snapshot.params['email'];
    this.token = this.route.snapshot.params['token'];
   }

  ngOnInit() {
  }

  fnLogMeIn(){
    localStorage.setItem('email', this.email);
    localStorage.setItem('user', this.email.split('@')[0]);
    this.router.navigate(['/activation/'+ this.token]);
  }

  fnResend(){
    console.log(this.email);
    this.rs.fnResendMail({
      email: this.email
    }).subscribe(user => {
      console.log(user);
    },
    err => {
      console.log(err);
    });
  }

}
