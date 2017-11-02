import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { CatalogPage } from '../catalog/catalog';
import { WebserviceProvider } from '../../providers/webservice/webservice';

import { Global } from '../../providers/global';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email = '';
  pwd = '';
  msg = '';
  auth = '';
  lang = [
    {
      val: 'de',
      desc: 'Deutsch'
    },
    {
      val: 'en',
      desc: 'English'
    },
    {
      val: 'es',
      desc: 'Español'
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCntrl: AlertController,
  private ws: WebserviceProvider,
  private g: Global) {
  }

  selectLang(lang: any){
    console.log(lang);
    this.g.translate.use(lang);
    localStorage.setItem('i18n', lang);
    this.g.Lang = lang;
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
     var accountID = localStorage.getItem('email');
    if(this.g.Network){
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
    else if (this.email == accountID){
      let alert = this.alertCntrl.create({
        title: 'Logging in Offline',
        message: 'Are you sure you want to log in offline? You will be kicked out the next time you use a network required feature',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Login anyway!',
            handler: () => {
              console.log('Buy clicked');
              this.navCtrl.setRoot(CatalogPage);
              this.msg = this.email = this.pwd = '';
            }
          }
        ]
      })
      alert.present();
    }
    else{
      this.msg = 'Network Connection is required to Login!'
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
