import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingModule } from './main/main.routing';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MainService } from './main.service';
import { GlobalService } from './global.service';
import { ResourceService } from './resource.service';
import { UserComponent } from './user/user.component';
import { ResendComponent } from './resend/resend.component';
import { ForgotpwdComponent } from './forgotpwd/forgotpwd.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { ListComponent } from './list/list.component';
import { ResetpwdComponent } from './resetpwd/resetpwd.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule
  ],
  declarations: [
                  MainComponent,
                  LoginComponent,
                  HomeComponent,
                  UserComponent,
                  ResendComponent,
                  ForgotpwdComponent,
                  UserinfoComponent,
                  ListComponent,
                  ResetpwdComponent,
                  SettingsComponent
                ],
  providers: [
                ResourceService,
                MainService,
                GlobalService
             ],
  bootstrap: [MainComponent]
})
export class MainModule { }
