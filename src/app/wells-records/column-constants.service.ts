import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColumnConstantsService {
  public WELL_RECORD_COLUMNS = [
    'select',
    'wellId',
    'operator',
    'wellName',
    'wellNumber',
    'status',
    'Classification',
    'Datum Elevation',
    'datumType',
    'Ground Elevation',
    'TD',
    'Formation at TD',
    'spudDate',
    'completionDate',
    'reports'
  ];
  public CP_COLUMNS = [
    "Well ID",
    "Observation Number",
    "Completion Type",
    "Date",
    "Completed Formation",
    "Top Depth",
    "Base Depth",
    "Top Formation",
    "Base Formation",
    "Remarks"
  ];
  public FT_COLUMNS = [
    "Well ID",
    "Observation Number",
    "Formation",
    "Top MD",
    "Base MD",
    "Top TVD",
    "Remarks",
    "Source"

  ];
  public MC_COLUMNS = [
    "Well ID",
    "Casing ID",
    "Casing Size",
    "Casing Type",
    "Top Depth",
    "Base Depth",
    "Top Formation",
    "Base Formation",
    "Nominal Weight",
    "Grade"
  ];
  public PF_COLUMNS = [
    "Well ID",
    "Completion Observation Number",
    "Perforation Observation Number",
    "Top Depth",
    "Base Depth",
    "Top Formation",
    "Date",
    "Remarks",
  ];
  public SURVEY_COLUMNS = [
    "Well ID",
    "Survey Point Number",
    "MD",
    "TVD",
    "Inclination",
    "Azimuth",
    "NS_OffSet",
    "ES_OffSet",
    "Latitude",
    "Longitude",
  ];
  public IP_COLUMNS = [
    "Well ID",
    "Test Number",
    "Top Depth",
    "Base Depth",
    "Top Formation",
    "Test Date",
    "Oil Volume",
    "Gas Volume",
    "Water Volume",
    "Choke",
  ];

  constructor() { }
}
