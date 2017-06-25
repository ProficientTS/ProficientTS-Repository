import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../resource.service';
@Component({
  selector: 'pts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  show = false;
  data = [];
  type = this.route.snapshot.params['type'];
  type1 = this.route.snapshot.params['type1'];
  type2 = this.route.snapshot.params['type2'];
  headConfig = {};

  constructor(private ms: MainService, private route: ActivatedRoute,
    private router: Router, private rs: ResourceService) {   }

  ngOnInit() {
    console.log(this.type)
    console.log(this.type1)
    console.log(this.type2)
    if(this.type === undefined){
    this.type = this.type2;
  }
  this.headConfig = {
                title: 'List by ' + this.type,
                userpic: true
             };
    this.ms.header.emit(this.headConfig);
    var inp = {type: this.type}
    console.log(inp);
    this.rs.getList({type: 'part'}).subscribe(posts => {
            console.log(posts);
            this.fnList(posts);
        },
        err => {
            console.log('Data Error')
        });
  }

  fnList(data){
    if(data.success){
      this.show = true;
      this.data = data.data;
    }
  }

  fnSelectList(data){
    console.log(data)
  }

}
