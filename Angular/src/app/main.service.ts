// import { Injectable, EventEmitter } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/Rx';

// @Injectable()
import { EventEmitter } from '@angular/core';
export class MainService {

header = new EventEmitter<any>();
  constructor(){
      console.log('Post');
  }

}
