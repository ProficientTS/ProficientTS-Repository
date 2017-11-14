import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Menu } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CatalogPage } from '../pages/catalog/catalog';
import { SharePage } from '../pages/share/share';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { ProductTabPage } from '../pages/catalog/producttab/producttab';
import { Global } from '../providers/global';
import * as _ from 'underscore';


declare global {
  var Nedb;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Menu) menu: Menu;

  rootPage: any;

  pages: any;
  
  constructor(public platform: Platform, public menuCntrl: MenuController,  public statusBar: StatusBar, public splashScreen: SplashScreen,
  private g: Global) {
    console.log(_);
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', icon: 'fa fa-bar-chart' , selected: false},
      { title: 'Catalog', icon: 'fa fa-book' , component: CatalogPage , selected: true},
      { title: 'Case', icon: 'fa fa-stethoscope' , selected: false},
      { title: 'Inventory', icon: 'fa fa-medkit' , selected: false},
      { title: 'Order', icon: 'fa fa-list-alt' , selected: false},
      { title: 'Settings', icon: 'fa fa-cog' , component: SettingsPage , selected: false}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.menuCntrl.open();
      console.log(this.menu);
      // this.menu.persistent = true;
      console.log(this.menuCntrl);
      // localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVzaGNvbEBwcm9maWNpZW50dHMuY29tIiwicGFzc3dvcmQiOiJKZXN1cyIsInRva2VuIjpudWxsLCJpYXQiOjE1MDc5NzA3NTksImV4cCI6MTUwODE0MzU1OX0.FGuamGAgCKTk_yTXg9Gd_TLe9kdF4fWHSOlXuUZz7Ok")
      setTimeout(()=>{
        if(localStorage.getItem('token') !== null){
          this.g.split = true;
          this.rootPage = CatalogPage;
        }
        else{
          this.rootPage = LoginPage;
        }
      }, 3000);
    });
  }

  openPage(page, index: number) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this 
    _.each(this.pages, (v) => {
      v.selected = false;  
    })
    this.pages[index].selected = true;
    if(page.component)
      this.nav.setRoot(page.component);
  }
}
