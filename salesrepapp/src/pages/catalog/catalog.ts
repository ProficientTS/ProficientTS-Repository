import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductTabPage } from '../catalog/producttab/producttab';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { PartDetailPage } from '../catalog/partdetail/partdetail';
import { SetDetailPage } from '../catalog/setdetail/setdetail';

@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html',
})
export class CatalogPage {
listItem = [];
display: boolean = false;
type = "";
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CatalogPage');
  }

  showProduct() {
    this.type = "system";
    this.display = true;
    this.ws.postCall('list/system', {})
    .then(data => {
      this.searchData(data);
    });
    // this.ws.postCall('display/system/207.35', {})
    // .then(data => {
    //   this.handleData(data);
    // });
  }

  showTechniques() {
    this.display = true;
    this.type = "technique";
    this.ws.postCall('list/technique', {})
    .then(data => {
      this.searchData(data);
    });
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

  // handleData(data: any){
  //   if(data.success){
  //     this.navCtrl.push(ProductTabPage, {
  //       data: data.data,
  //       type: this.type
  //     });
  //   }   
  // }

  searchItem(v: any, s: any){
    console.log(v);
    console.log(s)
    if(v.length >= 3){
      this.display = true;
      this.type = s;
      this.ws.postCall('list/' + s + '/name/' + v, {})
      .then(data => {
        this.searchData(data);
      });
    }
    else{
      this.listItem = [];
    }
  }

  searchData(data: any){
    console.log(data);
    if(data.data.length){
      this.listItem = data.data;
    }
    else{
      this.listItem = [];
    }
    // this.listItem = data;
  }

  itemTapped(item) {
    console.log(item)
    console.log(this.type)

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

  }

  setData(data: any){
    console.log(data.data)
    this.listItem = data.data;
  }

}
