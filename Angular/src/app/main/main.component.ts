import { Component , OnInit, OnChanges, DoCheck, AfterViewInit, AfterContentChecked, AfterContentInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { ResourceService } from '../resource.service';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'pts-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: []
})
export class MainComponent implements OnInit, OnChanges, DoCheck, AfterViewInit, AfterContentChecked, AfterContentInit, AfterViewChecked {
temptoken: string;
head: boolean;
view = false;
userpic = true;
title = '';
email = '';
  constructor(
    private route: ActivatedRoute,
    private rs: ResourceService,
    private router: Router,
    private ms: MainService,
    private gs: GlobalService) {
      // alert("constructor")
      this.ms.header.subscribe(
        (val: any) => this.setUp(val)
      );
      // router.events
      // .subscribe((event) => {
      //   if(event instanceof NavigationEnd) {
      //     console.log(event)
          
      //     // else if (localStorage.getItem('token') == null){
      //     //   this.router.navigate(['/login']);
      //     // }
      // }
      // });
      this.temptoken = this.route.snapshot.params['temptoken'];
          console.log(this.temptoken);
          // if(this.temptoken != undefined) {
          //   this.chkUser(this.temptoken);
          // }
          // else
          //  if(localStorage.getItem('token') != null){
          //   this.fnUserChk(localStorage.getItem('token'));
          // }
     }

  ngOnInit() {
    console.log('Temp Token from Mail' + this.route.snapshot.params['temptoken']);
    // alert("ngOnInit")
  }

  ngOnChanges(){
    // alert("ngOnChanges")
  }

  ngDoCheck(){
    // alert("ngDoCheck")
  }

  ngAfterContentChecked() {
    // alert("ngAfterContentChecked")
  }

  ngAfterContentInit() {
    // alert("ngAfterContentInit")
  }

  ngAfterViewChecked() {
    // alert("ngAfterViewChecked")
  }

  ngAfterViewInit() {
    // alert("ngAfterViewInit")
  }
// common fn to check user is valid throughout the app
  fnUserChk(token){
    this.rs.uservalidation({
        token: token
      }).subscribe(user => {
        console.log(user);
        if (user.success) {
          console.log("------------------ You're Good --------------------");
          this.email = user.data[0].email;
        }
        else{
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      },
      err => {
        console.log(err);
      })
  }

  setUp(val){
    if(val){
      console.log(val)
      this.head = val.head !== undefined ? val.head : true;
      this.title = val.title !== undefined ? val.title : '';
      this.userpic = val.userpic !== undefined ? val.userpic : false;
    }
    else{
      this.title = '';
    }
  }

  chkUser(tkn: any){
    this.rs.saveUserSignUp({
        token: tkn
      }).subscribe(user => {
        console.log(user);
        if (user.success) {
          localStorage.setItem('token', user.token);
          this.router.navigate(['/home']);
        }
      },
      err => {
        console.log(err);
      })
  }

}
