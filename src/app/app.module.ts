import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { WellsRecordsComponent } from './wells-records/wells-records.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { WellDetailComponent } from './well-detail/well-detail.component';
import { ChartsModule } from 'ng2-charts';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterDialog } from './utils/matDialog/filterDialog.component';
import { HeaderComponent } from './header/header.component';
import { MapLegendComponent } from './map-legend/map-legend.component';
// import { RouterStateSnapshot } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    WellsRecordsComponent,
    WellDetailComponent,
    LoginComponent,
    FilterDialog,
    HeaderComponent,
    MapLegendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
