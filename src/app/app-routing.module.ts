import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WellDetailComponent } from './well-detail/well-detail.component';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './user-auth/login/login.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { ForgotPasswordComponent } from './user-auth/forgot-password/forgot-password.component';
import { CreateAccountComponent } from './user-auth/create-account/create-account.component';
import { AdminComponent } from './admin/admin.component';
import { ResetPasswordComponent } from './user-auth/reset-password/reset-password.component';
import { UserInfoComponent } from './admin/user-info/user-info.component';
import { ActivateUser } from './user-auth/activate-user/activate-user.component';
import { AuthGuard } from './_services/auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: MapComponent
  },
  {
    path: 'detail/:id',
    component: WellDetailComponent
  },
  {
    path: 'user-auth',
    component: UserAuthComponent, children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'create-account',
        component: CreateAccountComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'activate-user',
        component: ActivateUser
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user-info/:id',
    component: UserInfoComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
