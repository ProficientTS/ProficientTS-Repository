import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'pts-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.css']
})
export class ResendComponent implements OnInit {
temptoken = "";
  constructor(private gs: GlobalService) { }

  ngOnInit() {
    this.temptoken = this.gs.data;
  }

}
