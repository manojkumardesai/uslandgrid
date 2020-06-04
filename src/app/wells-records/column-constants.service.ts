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
  public FT_COLUMNS = [
    "Well ID",
    "Formation",
    "Top MD",
    "Top TVD",
    "Remarks",
    "FormationCode",
    "temp1",
    "Base MD",
    "Source"
  ];
  public MC_COLUMNS = [
    "Record ID (MC)",
    "Well ID",
    "Casing ID",
    "Data Source",
    "Casing Size",
    "Inside Diameter",
    "Top Depth",
    "Base Depth",
    "Top Formation",
    "Base Formation",
    "Casing Type",
    "Nominal Weight",
    "Grade",
    "Thread Type",
    "Manufacturer",
    "Multistage Depth",
    "Cement Type",
    "Cement Amount",
    "Cement Weight",
    "Hole Size",
    "Top of Cement",
    "Slurry Volume",
    "Connect Code",
    "Install Date",
    "Leak Off Test",
    "Pressure Test",
    "Create Date",
    "Create User ID",
    "Update User ID",
    "Update date",
    "Remarks",
    "Feet",
    "PSI",
    "SAX"
  ];
  public PF_COLUMNS = [
    "Well ID",
    "Date",
    "Top Depth",
    "Base Depth",
    "Top Formation",
    "Type",
    "Density",
    "Diameter",
    "Phase",
    "Angle",
    "Count",
    "Current Status"
  ];
  public SURVEY_COLUMNS = [
    "Well ID",
    "MD",
    "TVD",
    "Inclination",
    "Azimuth",
    "NS_OffSet",
    "ES_OffSet",
    "Latitude",
    "Longitude"
  ];
  public IP_COLUMNS = [
    "Well ID",
    "Row Number",
    "Test Number",
    "Top Depth",
    "Base Depth",
    "Top Formation",
    "Base Formation",
    "Test Date",
    "Test Duration",
    "Oil Volume",
    "Oil Rate",
    "Gas Volume",
    "Gas Rate",
    "Water Volume",
    "Water Rate",
    "Flow Pressure",
    "Bh Pressure",
    "Choke",
    "Bh Temperature",
    "Oil Gravity",
    "H2S",
    "CO2",
    "Remarks",
    "Gas Depth",
    "Gas Type"
  ];

  constructor() { }
}
