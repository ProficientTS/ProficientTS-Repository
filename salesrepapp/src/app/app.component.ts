import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
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

  rootPage: any;

  pages: Array<{title: string, component: any}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
  private g: Global) {
    console.log(_);
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Catalog', component: CatalogPage },
      { title: 'Settings', component: SettingsPage },
      { title: 'Review Page', component: SharePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVzaGNvbEBwcm9maWNpZW50dHMuY29tIiwicGFzc3dvcmQiOiJKZXN1cyIsInRva2VuIjpudWxsLCJpYXQiOjE1MDc5NzA3NTksImV4cCI6MTUwODE0MzU1OX0.FGuamGAgCKTk_yTXg9Gd_TLe9kdF4fWHSOlXuUZz7Ok")
      this.rootPage = (localStorage.getItem('token') !== null) ? CatalogPage : LoginPage;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
