import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WellDetailComponent } from './well-detail/well-detail.component';
import { MapComponent } from './map/map.component';


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
    path: 'detail',
    component: WellDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
