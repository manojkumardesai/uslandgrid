import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { AdvancedFilterComponent } from './wells-records/advFilterDialog/advanced-filter/advanced-filter.component';
import { MultiSelectComponent } from './shared/multi-select/multi-select.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InfoWindowComponent } from './map/info-window/info-window.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
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
    MapLegendComponent,
    AdvancedFilterComponent,
    MultiSelectComponent,
    InfoWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    DragDropModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
