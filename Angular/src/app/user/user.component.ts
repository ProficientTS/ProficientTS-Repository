import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
@Component({
  selector: 'pts-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
email = '';
logout = false;
  constructor(private router: Router, private gs: GlobalService) {
    
   }

  ngOnInit() {
    this.email = (this.gs.data && this.gs.data.email)? this.gs.data.email : localStorage.getItem('email');
  }

  fnlogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
