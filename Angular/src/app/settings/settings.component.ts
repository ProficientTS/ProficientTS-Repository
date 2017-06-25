import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { ResourceService } from '../resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pts-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
headConfig = {
                title: 'Settings',
                userpic: true
             };
  constructor(private ms: MainService,
  private rs: ResourceService,
  private router: Router) { }

  ngOnInit() {
    this.ms.header.emit(this.headConfig);
  }

  fnResetPwd(){
    this.router.navigate(['/resetpwd']);
  }

}
