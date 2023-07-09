import { Injectable } from '@angular/core';

import { ImagePosition, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ArchivoExcelInterface, HojaExcelInterface } from 'src/app/interfaces/excel.interface';
import { LOGO } from 'src/assets/images/logo/logo';


@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private workbook!: Workbook;

  constructor() {}

  async dowloadExcel(archivo: ArchivoExcelInterface): Promise<void> {
    this.workbook = new Workbook();

    this.workbook.creator = 'DigiDev';
    for (let hoja of archivo.hojas) {
      this.createSheet(hoja);
    }
    this.workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, `${archivo.nombre}.xlsx`);
    });
  }

  private createSheet(hoja: HojaExcelInterface) {
    const sheet = this.workbook.addWorksheet(hoja.nombre);
    let col = 1;
    for (let ancho of hoja.anchoColumnas) {
      sheet.getColumn(col).width = ancho;
      col++;
    }

    if (hoja.alineacionColumnas !== undefined) {
      let col = 1;
      for (let alineacion of hoja.alineacionColumnas) {
        sheet.getColumn(col).alignment = alineacion;
        col++;
      }
    }

    // INSERTAR LOGO
    const logoId = this.workbook.addImage({
      base64: LOGO,
      extension: 'png',
    });
    // sheet.addImage(logoId,'A1:B4');//insertar con rango

    // insertar con posicion
    const position: ImagePosition = {
      tl: { col: 0.15, row: 0.15 },
      ext: { width: 100, height: 100 },
    };

    if (hoja.cabeceraHoja !== undefined) {
      let titulo;
      let subtitulo;

      if (hoja.cabeceraHoja.logo) {
        sheet.addImage(logoId, position);
        titulo = sheet.getCell('B2');
        subtitulo = sheet.getCell('B3');
      } else {
        titulo = sheet.getCell('A2');
        subtitulo = sheet.getCell('A3');
      }

      titulo.value = hoja.cabeceraHoja.titulo;
      titulo.style.font = { bold: true, size: 18 };
      titulo.style.alignment = { horizontal: 'left' };

      subtitulo.value = hoja.cabeceraHoja.subtitulo;
      subtitulo.style.font = { bold: true, size: 16 };
      subtitulo.style.alignment = { horizontal: 'left' };
    }

    const cabeceraColumnas = sheet.getRow(5);
    cabeceraColumnas.values = hoja.cabecerasColumnas;

    for (let col = 1; col <= hoja.cabecerasColumnas.length; col++) {
      cabeceraColumnas.getCell(col).border = {
        top: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
      };
    }
    cabeceraColumnas.alignment = { horizontal: 'center', vertical: 'middle' };
    cabeceraColumnas.font = { bold: true, size: 12 };
    const filas = sheet.getRows(6, hoja.dataColumnas.length)!;

    for (let index = 0; index < filas.length; index++) {
      const itemData = hoja.dataColumnas[index];
      const fila = filas[index];
      fila.values = itemData;
    }
  }
}
