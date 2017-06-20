import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';
@Component({
  selector: 'pts-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.css']
})
export class ResendComponent implements OnInit {
token = "";
  constructor(private gs: GlobalService, private router: Router) { }

  ngOnInit() {
    this.token = this.gs.data.token;
  }

  fnLogMeIn(){
    console.log(this.gs.data.email)
    localStorage.setItem('email', this.gs.data.email);
    this.router.navigate(['/activation/'+ this.token]);
  }

}
