import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
@Component({
  selector: 'pts-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
user = '';
options = false;
  constructor(private router: Router, private gs: GlobalService) { }

  ngOnInit() {
    this.user = (this.gs.data && this.gs.data.email)? this.gs.data.email.split('@')[0] : localStorage.getItem('email').split('@')[0];
  }

  fnlogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  fnSettings(){
    this.options = false;
    this.router.navigate(['/settings']);
  }

  fnHome(){
    this.options = false;
    this.router.navigate(['/home']);
  }
  fnUser(){
    this.options = false;
    this.router.navigate(['/user']);
  }
}
