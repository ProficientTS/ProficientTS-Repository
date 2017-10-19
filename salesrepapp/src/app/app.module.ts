import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule, Http } from '@angular/http';
import { HttpClient, HttpClientModule  } from '@angular/common/http';

import { MyApp } from './app.component';
import { CatalogPage } from '../pages/catalog/catalog';
import { SharePage } from '../pages/share/share';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { ProductDetailPage } from '../pages/catalog/productdetail/productdetail';
import { ProductTabPage } from '../pages/catalog/producttab/producttab';
import { ProductDocumentPage } from '../pages/catalog/productdocument/productdocument';
import { ProductImagePage } from '../pages/catalog/productimage/productimage';
import { ProductVideoPage } from '../pages/catalog/productvideo/productvideo';
import { ProductPartPage } from '../pages/catalog/productpart/productpart';
import { ProductSetPage } from '../pages/catalog/productset/productset';
import { PartDetailPage } from '../pages/catalog/partdetail/partdetail';
import { SetDetailPage } from '../pages/catalog/setdetail/setdetail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WebserviceProvider } from '../providers/webservice/webservice';
import { Global } from '../providers/global';

import { DocumentViewer } from '@ionic-native/document-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Network } from '@ionic-native/network';
import { HeaderComponent } from '../pages/header/header.component';
import { FileTransfer } from '@ionic-native/file-transfer';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    CatalogPage,
    MyApp,
    SettingsPage,
    LoginPage,
    ProductDetailPage,
    ProductTabPage,
    ProductDocumentPage,
    ProductImagePage,
    ProductVideoPage,
    ProductPartPage,
    ProductSetPage,
    PartDetailPage,
    SetDetailPage,
    SharePage,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages:true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CatalogPage,
    MyApp,
    SettingsPage,
    LoginPage,
    ProductDetailPage,
    ProductTabPage,
    ProductDocumentPage,
    ProductImagePage,
    ProductVideoPage,
    ProductPartPage,
    ProductSetPage,
    PartDetailPage,
    SetDetailPage,
    SharePage,
    HeaderComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WebserviceProvider,
    DocumentViewer,
    PhotoViewer,
    File,
    Global,
    UniqueDeviceID,
    Network,
    FileTransfer
  ]
})
export class AppModule {}
