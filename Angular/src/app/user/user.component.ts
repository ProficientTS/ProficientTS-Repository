import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'pts-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
@Input() email = '';
logout = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  fnlogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
