import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { CatalogPage } from '../pages/catalog/catalog';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { ListPage } from '../pages/list/list';
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

import { Device } from '@ionic-native/device';
import { Camera } from '@ionic-native/camera';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { ImagePicker } from '@ionic-native/image-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { VideoPlayer } from '@ionic-native/video-player';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Network } from '@ionic-native/network';
import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    CatalogPage,
    MyApp,
    HomePage,
    SettingsPage,
    ListPage,
    LoginPage,
    ProductDetailPage,
    ProductTabPage,
    ProductDocumentPage,
    ProductImagePage,
    ProductVideoPage,
    ProductPartPage,
    ProductSetPage,
    PartDetailPage,
    SetDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages:true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CatalogPage,
    MyApp,
    HomePage,
    SettingsPage,
    ListPage,
    LoginPage,
    ProductDetailPage,
    ProductTabPage,
    ProductDocumentPage,
    ProductImagePage,
    ProductVideoPage,
    ProductPartPage,
    ProductSetPage,
    PartDetailPage,
    SetDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WebserviceProvider,
    Device,
    Camera,
    ImagePicker,
    DocumentViewer,
    PhotoViewer,
    StreamingMedia,
    Media,
    File,
    VideoPlayer,
    Global,
    UniqueDeviceID,
    Network,
    EmailComposer
  ]
})
export class AppModule {}
