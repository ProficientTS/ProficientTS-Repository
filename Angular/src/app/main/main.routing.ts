import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { ResendComponent } from '../resend/resend.component';
import { ForgotpwdComponent } from '../forgotpwd/forgotpwd.component';
import { MainComponent } from './main.component';
import { ListComponent } from '../list/list.component';
import { SettingsComponent } from '../settings/settings.component';
import { ResetpwdComponent } from '../resetpwd/resetpwd.component';
import { UserinfoComponent } from '../userinfo/userinfo.component';

const mainRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'activation/:token',
        component: MainComponent
    },
    {
        path: 'loginconfirmation/:email/:token',
        component: ResendComponent
    },
    {
        path: 'forgotpwd',
        component: ForgotpwdComponent
    },
    {
        path: 'resetpwd',
        component: ResetpwdComponent
    },
    {
        path: 'list/:type',
        component: ListComponent
    },
    {
        path: 'list/:type1/:type2/:id',
        component: ListComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'user',
        component: UserinfoComponent
    }
];

export const RoutingModule: ModuleWithProviders = RouterModule.forRoot(mainRoutes);