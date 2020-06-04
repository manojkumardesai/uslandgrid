import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColumnConstantsService {
  public WELL_RECORD_COLUMNS = [
    'select',
    'wellId',
    'wellName',
    'operator',
    'wellNumber',
    'status',
    'latitude',
    'longitude',
    'spudDate',
    'completionDate',
    'county',
    'datumType',
    'tvd',
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
    "Base Formation"
  ];
  constructor() { }
}
