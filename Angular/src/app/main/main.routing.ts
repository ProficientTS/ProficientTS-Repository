import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { ResendComponent } from '../resend/resend.component';
import { ForgotpwdComponent } from '../forgotpwd/forgotpwd.component';
import { MainComponent } from './main.component';
import { ListComponent } from '../list/list.component';

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
        path: 'activation/:temptoken',
        component: MainComponent
    },
    {
        path: 'loginconfirmation',
        component: ResendComponent
    },
    {
        path: 'forgotpwd',
        component: ForgotpwdComponent
    },
    {
        path: 'forgotpwd/:fptoken',
        component: ForgotpwdComponent
    },
    {
        path: 'list/:type',
        component: ListComponent
    },
    {
        path: 'list/:type1/:type2/:id',
        component: ListComponent
    }
];

export const RoutingModule: ModuleWithProviders = RouterModule.forRoot(mainRoutes);