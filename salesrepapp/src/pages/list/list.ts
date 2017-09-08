import { Component, Input, OnInit, OnChanges, DoCheck, AfterViewInit, AfterContentChecked, AfterContentInit, AfterViewChecked } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ProductTabPage } from '../catalog/producttab/producttab';
import { PartDetailPage } from '../catalog/partdetail/partdetail';
import { SetDetailPage } from '../catalog/setdetail/setdetail';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit, OnChanges, DoCheck, AfterViewInit, AfterContentChecked, AfterContentInit, AfterViewChecked  {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string}>;
  @Input() listItem = [];
  @Input() type = "";
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider) {
    console.log(this.listItem);
    this.listItem = [];
  
  }

  itemTapped(item) {
    console.log(item)
    console.log(this.type)
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });

    if(this.type === "technique" && item.Name === undefined){
      this.ws.postCall('list/'+this.type+'/'+ item.ID + '/system' , {})
      .then(data => {
        this.setData(data);
      });
    }
    else if(this.type === "technique" && item.Name !== undefined){
      this.ws.postCall('display/system/'+ item.ID, {})
      .then(data => {
        this.handleData(data);
      });
    }
    else{
      this.ws.postCall('display/'+this.type+'/'+ item.ID, {})
      .then(data => {
        this.handleData(data);
      });
    }

    // console.log(JSON.stringify(data.data))
          // this.navCtrl.push(ProductTabPage, {
          //   data: [{"_id":"595ac5822a723f4e6d6dc2bd","system_id":"207.35","system_nm":"Bigil","desc":"<p><strong>Designed for simplicity</strong></p><br><p>The Binary Anterior Cervical Plate System was designed for ease of use and reduced operation time. This cervical plate features a state-of-the-art locking mechanism that uses our proprietary Helios Technology.</p><br><p><strong>Hear it, feel it, see it</strong></p><br><p>The Helios lock provides the surgeon with audible, tactile, and visual confirmation that the screw is captured by the lock. The Binary Anterior Cervical Plate has a smooth low-profile design and incorporates lordotic curvature to minimize plate contouring by the surgeon during the procedure.</p><br><p><strong>Helios Technology for Anti-Rotation and Anti-Back-Out</strong></p><br><p>The Helios Technology locking mechanism allows the lock to open as the screw head passes during screw insertion and then return to its original position, capturing the screw head. The interface between the Helios lock and cervical screw resists both counter-rotation and screw back-out.</p>","img":[{"url":"assets/product/image/image-1.png","title":"Image 1"},{"url":"assets/product/image/image-2.png","title":"Image 2"},{"url":"assets/product/image/image-3.png","title":"Image 3"},{"url":"assets/product/image/image-4.png","title":"Image 4"}],"video":[{"title":"Cornetto Bigil Interbody System Surgeon Technical Guide","url":"assets/product/video/Bigil.mp4"},{"title":"Cornetto Bigil Interbody System Surgeon Technical Guide","url":"assets/product/video/Bigil.mp4"}],"doc":[{"title":"Cornetto Bigil Interbody System Surgeon Technical Guide","url":"assets/product/doc/Bigil.txt"},{"title":"Cornetto Bigil Interbody System Surgeon Technical Guide","url":"assets/product/doc/Bigil.txt"}],"technique":[{"technique_nm":"Freo"}],"part":[{"part_id":"170.56","part_nm":"Screw 5mm S","url":"assets/product/image/image-2.png"},{"part_id":"179.46","part_nm":"Bolt 10mm","url":"assets/product/image/image-3.png"}],"set":[{"set_id":"207.35.10","set_nm":"Bigil 207.35 5mm C","url":"assets/product/image/image-1.png","desc":"Curated Rod Bender","qty":15},{"set_id":"207.35.12","set_nm":"Bigil 207.35 10mm L","url":"assets/product/image/image-4.png","desc":"Bent Rod Bender","qty":25}],"group":[{"group_id":"107.35.10","group_nm":"Bigil 207.35 IP"},{"group_id":"107.35.12","group_nm":"Bigil 207.35 IN"}]}],
          //   type: "system"
          // });
  }

  setData(data: any){
    console.log(data.data)
    this.listItem = data.data;
  }

    handleData(data: any){
      console.log(this.type)
    if(data.success){
      switch(this.type){
        case "part":
          this.navCtrl.push(PartDetailPage, {
            data: data.data
          });
          break;
        case "set":
          this.navCtrl.push(SetDetailPage, {
            data: data.data
          });
          break;
        case "technique":
        case "system":
          this.navCtrl.push(ProductTabPage, {
            data: data.data,
            type: this.type
          });
          break;
      }
      
    }   
  }

  ionViewWillEnter(){
    // console.log('ionViewWillEnter LoginPage');
  }

  ionViewCanEnter(){
    // console.log('ionViewCanEnter LoginPage');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter(){
    // console.log('ionViewDidEnter LoginPage');
  }

  ngOnInit() {
    // console.log('Token from Mail ----');
    // alert("ngOnInit")
  }

  ngOnChanges(){
    console.log("ngOnChanges of List")
    console.log(this.listItem);
    console.log(this.type);
  }

  ngDoCheck(){
    // console.log("ngDoCheck")
  }

  ngAfterContentChecked() {
    // console.log("ngAfterContentChecked")
  }

  ngAfterContentInit() {
    // console.log("ngAfterContentInit")
  }

  ngAfterViewChecked() {
    // console.log("ngAfterViewChecked")
  }

  ngAfterViewInit() {
    // console.log("ngAfterViewInit")
  }


}
