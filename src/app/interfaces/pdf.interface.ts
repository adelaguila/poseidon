import { Alignment } from './../../../node_modules/exceljs/index.d';
export interface PdfTableInterface{
  layout: string;
  table: TablePdf;
}

export interface TablePdf{
  headerRow: number;
  widths: any[];
  body: BodyTablePdf;
}

export interface CampoTable{
  value: string,
  alignment: string
}

export interface BodyTablePdf{
  headers: string[];
  rows: CampoTable[];
}
