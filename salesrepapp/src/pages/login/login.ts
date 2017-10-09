import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Device } from '@ionic-native/device';

import { CatalogPage } from '../catalog/catalog';
import { WebserviceProvider } from '../../providers/webservice/webservice';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email = '';
  pwd = '';
  msg = '';
  auth = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private ws: WebserviceProvider,
  private device: Device) {
    console.log('Device UUID is: ' + this.device.uuid);
    console.log(this.device);
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter LoginPage');
  }

  ionViewCanEnter(){
    console.log('ionViewCanEnter LoginPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter LoginPage');
  }

  clickLogin() {
    if(this.email && this.pwd){
      this.ws.postCall("auth/", {
          email: this.email.toLowerCase(),
          password: this.pwd
      }).then(data => {
        this.fnhandlesignin(data);
      });
    }
    else{
      this.msg = 'Please provide all Login details'
    }
  }

  fnhandlesignin(data) {
    console.log(data);
    if (data.success) {
      localStorage.setItem('token', data.token);
      console.log(data.data[0].email.split('@')[0])
      localStorage.setItem('email', data.data[0].email);
      localStorage.setItem('user', data.data[0].email.split('@')[0]);
      this.navCtrl.setRoot(CatalogPage);
      this.msg = this.email = this.pwd = '';
    }
    else{
      this.msg = data.msg;
    }

  }

}
