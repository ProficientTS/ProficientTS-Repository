import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'pts-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
headConfig = {
                title: 'Catalog',
                userpic: true
             };
  constructor(private ms: MainService) { 

   }

  ngOnInit() {
    this.ms.header.emit(this.headConfig);
  }

}
