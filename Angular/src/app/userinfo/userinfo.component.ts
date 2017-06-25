import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'pts-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {
  email = '';
  user = '';
headConfig = {
                title: 'User Profile',
                userpic: true
             };
  constructor(
    private ms: MainService,
    private gs: GlobalService) { }

  ngOnInit() {
    this.ms.header.emit(this.headConfig);
    this.email = (this.gs.data && this.gs.data.email)? this.gs.data.email : localStorage.getItem('email');
    this.user = this.email.split('@')[0];
  }

}
