import { Injectable } from "@angular/core";

import { LOGO } from "src/assets/images/logo/logo";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { PdfTableInterface } from "src/app/interfaces/pdf.interface";

declare var require: any;

const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: "root",
})
export class PdfService {
    empresaNombre = environment.empresa_nombre;
    empresaDireccion = environment.empresa_direccion;
    empresaTelefono = environment.empresa_telefono;
    empresaEmail = environment.empresa_email;
    empresaUbigeo = environment.empresa_ubigeo;
    empresaWeb = environment.empresa_web;

    constructor() {}

    async exportToPdf(
        archivoPdf: PdfTableInterface,
        fileName: string,
        title: string,
        pageSize: string = "A4",
        pageOrientation: string = "portrait"
    ) {
        const dataFormatted = {
            pageSize: pageSize,
            pageOrientation: pageOrientation,
            pageMargins: [20, 20, 20, 20],
            content: [
                this.generateTableHeader(title),
                {
                    layout: archivoPdf.layout,
                    table: {
                        headerRows: archivoPdf.table.headerRow,
                        // widths: ['*', 'auto', 100, '*'],
                        widths: archivoPdf.table.widths,
                        body: this.generarFilas(
                            archivoPdf.table.body.headers,
                            archivoPdf.table.body.rows
                        ),
                    },
                },
            ],
            styles: this.generateStyles(),
        };

        this.generatePdf(dataFormatted, fileName);
    }

    async ordenAtencionPdf(fileName: string) {
        const dataFormatted = {
            pageSize: "A4",
            pageOrientation: "portrait",
            pageMargins: [20, 20, 20, 20],
            content: [
                this.generateHeaderOrdenAtencion("Orden 00392"),
                {
                    margin: [0, 0, 0, 15],
                    table: {
                        headerRows: 1,
                        widths: [80, "*", 80, "*"],

                        body: [
                            [
                                this.generateColumn(
                                    `F.REGISTRO`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `2023-07-12`,
                                    "normalOrden"
                                ),
                                this.generateColumn(
                                    `F.ASIGNACION`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `2023-07-12`,
                                    "normalOrden"
                                ),
                            ],
                            [
                                this.generateColumn(
                                    `COD.ABONADO`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(`443`, "normalOrden"),
                                this.generateColumn(`NOMBRE`, "subheaderOrden"),
                                this.generateColumn(
                                    `ARMANDO DEL AGUILA BORBOR`,
                                    "normalOrden"
                                ),
                            ],
                            [
                                this.generateColumn(
                                    `DIRECCION`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `JR. INDENPENDENCIA 871`,
                                    "normalOrden"
                                ),
                                this.generateColumn(
                                    `REFERENCIA`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `ENTRE LA ESQUINA DE JR. PEDRO CANGA / JR. INDEPENDENCIA`,
                                    "normalOrden"
                                ),
                            ],
                            [
                                this.generateColumn(
                                    `TELEFONO`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(`966120389`, "normalOrden"),
                                this.generateColumn(
                                    `TECNICO`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `MIGUEL ANGEL VASQUEZ`,
                                    "normalOrden"
                                ),
                            ],
                        ],
                    },
                },
                {
                    margin: [0, 0, 0, 15],
                    table: {
                        headerRows: 1,
                        widths: [200, 55, 55, 55, "*"],
                        heights: [10, 10, 70, 30, 10],
                        body: [
                            [
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    colSpan: 4,
                                    alignment: "center",
                                    text: "MATERIALES UTILIZADOS",
                                    style: "subheaderOrden",
                                },
                                {},
                                {},
                                {},
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "INFORME/OBSERVACIONES",
                                    style: "subheaderOrden",
                                },
                            ],
                            [
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "DESCRIPCION",
                                    style: "subheaderOrden",
                                },
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "P.UNIT.",
                                    style: "subheaderOrden",
                                },
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "CANTIDAD",
                                    style: "subheaderOrden",
                                },
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "IMPORTE",
                                    style: "subheaderOrden",
                                },
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    text: "",
                                },
                            ],
                            [
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                            ],
                            [
                                {
                                    border: [true, true, true, true],
                                    colSpan: 2,
                                    text: "",
                                },
                                {},
                                {},
                                {
                                    border: [true, true, true, true],
                                    colSpan: 2,
                                    text: "",
                                },
                                {},
                            ],
                            [
                                {
                                    border: [true, true, true, true],
                                    colSpan: 2,
                                    alignment: "center",
                                    text: "ABONADO",
                                    style: "normalOrden",
                                },
                                {},
                                {},
                                {
                                    border: [true, true, true, true],
                                    colSpan: 2,
                                    alignment: "center",
                                    text: "TECNICO",
                                    style: "normalOrden",
                                },
                                {},
                            ],
                        ],
                    },
                },

                {
                    margin: [0, 15, 0, 20],
                    table: {
                        widths: ["*"],
                        body: [
                            [
                                {
                                    headerRows: 1,
                                    border: [false, false, false, true],
                                    text: "",
                                },
                            ],
                        ],
                    },
                },

                this.generateHeaderOrdenAtencion("Orden 00392"),
                {
                    margin: [0, 0, 0, 15],
                    table: {
                        headerRows: 1,
                        widths: [80, "*", 80, "*"],

                        body: [
                            [
                                this.generateColumn(
                                    `F.REGISTRO`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `2023-07-12`,
                                    "normalOrden"
                                ),
                                this.generateColumn(
                                    `F.ASIGNACION`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `2023-07-12`,
                                    "normalOrden"
                                ),
                            ],
                            [
                                this.generateColumn(
                                    `COD.ABONADO`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(`443`, "normalOrden"),
                                this.generateColumn(`NOMBRE`, "subheaderOrden"),
                                this.generateColumn(
                                    `ARMANDO DEL AGUILA BORBOR`,
                                    "normalOrden"
                                ),
                            ],
                            [
                                this.generateColumn(
                                    `DIRECCION`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `JR. INDENPENDENCIA 871`,
                                    "normalOrden"
                                ),
                                this.generateColumn(
                                    `REFERENCIA`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `ENTRE LA ESQUINA DE JR. PEDRO CANGA / JR. INDEPENDENCIA`,
                                    "normalOrden"
                                ),
                            ],
                            [
                                this.generateColumn(
                                    `TELEFONO`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(`966120389`, "normalOrden"),
                                this.generateColumn(
                                    `TECNICO`,
                                    "subheaderOrden"
                                ),
                                this.generateColumn(
                                    `MIGUEL ANGEL VASQUEZ`,
                                    "normalOrden"
                                ),
                            ],
                        ],
                    },
                },
                {
                    margin: [0, 0, 0, 15],
                    table: {
                        headerRows: 1,
                        widths: [200, 55, 55, 55, "*"],
                        heights: [10, 10, 70, 30, 10],
                        body: [
                            [
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    colSpan: 4,
                                    alignment: "center",
                                    text: "MATERIALES UTILIZADOS",
                                    style: "subheaderOrden",
                                },
                                {},
                                {},
                                {},
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "INFORME/OBSERVACIONES",
                                    style: "subheaderOrden",
                                },
                            ],
                            [
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "DESCRIPCION",
                                    style: "subheaderOrden",
                                },
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "P.UNIT.",
                                    style: "subheaderOrden",
                                },
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "CANTIDAD",
                                    style: "subheaderOrden",
                                },
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    alignment: "center",
                                    text: "IMPORTE",
                                    style: "subheaderOrden",
                                },
                                {
                                    border: [true, true, true, true],
                                    margin: [5, 5, 5, 5],
                                    text: "",
                                },
                            ],
                            [
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                                {
                                    border: [true, true, true, true],
                                    text: "",
                                },
                            ],
                            [
                                {
                                    border: [true, true, true, true],
                                    colSpan: 2,
                                    text: "",
                                },
                                {},
                                {},
                                {
                                    border: [true, true, true, true],
                                    colSpan: 2,
                                    text: "",
                                },
                                {},
                            ],
                            [
                                {
                                    border: [true, true, true, true],
                                    colSpan: 2,
                                    alignment: "center",
                                    text: "ABONADO",
                                    style: "normalOrden",
                                },
                                {},
                                {},
                                {
                                    border: [true, true, true, true],
                                    colSpan: 2,
                                    alignment: "center",
                                    text: "TECNICO",
                                    style: "normalOrden",
                                },
                                {},
                            ],
                        ],
                    },
                },
            ],
            styles: this.generateStyles(),
        };

        this.generatePdf(dataFormatted, fileName);
    }

    generarFilas(cabecera: any, data: any) {
        const bodyHeader = cabecera.map((f: any) => {
            return {
                margin: [0, 0, 0, 0],
                text: f,
                style: "subheader",
            };
        });

        const bodyRows = data.map((f: any) => {
            return f.map((c: any) => {
                return {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 0],
                    text: c.value,
                    alignment: c.alignment,
                    style: "normal",
                };
            });
        });

        bodyRows.unshift(bodyHeader);

        return bodyRows;
    }

    generateTableHeader(title: string) {
        return {
            margin: [0, 0, 0, 15],
            table: {
                widths: [70, "*"],
                body: [
                    [
                        {
                            borderWidth: ["1px", "1px", "1px", "1px"],
                            borderColor: ["#000", "#000", "#000", "#000"],
                            border: [false, false, true, false],
                            width: 60,
                            image: LOGO,
                        },
                        {
                            border: [false, false, false, false],
                            text: [
                                this.generateColumn(
                                    `${this.empresaNombre}\n`,
                                    "header"
                                ),
                                this.generateColumn(
                                    `${this.empresaDireccion} ${this.empresaUbigeo}\n`,
                                    "subheader"
                                ),
                                this.generateColumn(
                                    `Teléfono: ${this.empresaTelefono}\n`,
                                    "normal"
                                ),
                                this.generateColumn(
                                    `Email: ${this.empresaEmail}\n`,
                                    "normal"
                                ),
                                this.generateColumn(
                                    `Web: ${this.empresaWeb}\n`,
                                    "normal"
                                ),
                            ],
                        },
                    ],
                    [
                        {
                            border: [false, false, false, false],
                            margin: [5, 5, 5, 5],
                            colSpan: 2,
                            alignment: "center",
                            text: title,
                            style: "header",
                        },
                        {},
                    ],
                ],
            },
        };
    }

    generateHeaderOrdenAtencion(title: string) {
        return {
            margin: [0, 0, 0, 15],
            table: {
                widths: [50, 300, "*"],
                body: [
                    [
                        {
                            borderWidth: ["1px", "1px", "1px", "1px"],
                            borderColor: ["#000", "#000", "#000", "#000"],
                            border: [false, false, false, false],
                            width: 30,
                            image: LOGO,
                        },
                        {
                            border: [false, false, false, false],
                            text: [
                                this.generateColumn(
                                    `${this.empresaNombre}\n`,
                                    "header"
                                ),
                                this.generateColumn(
                                    `${this.empresaDireccion} ${this.empresaUbigeo}\n`,
                                    "subheader"
                                ),
                            ],
                        },
                        {
                            border: [true, true, true, true],
                            alignment: "center",
                            text: [
                                this.generateColumn(
                                    `ORDEN DE ATENCION\n`,
                                    "header"
                                ),
                                this.generateColumn(`44323\n`, "header"),
                            ],
                        },
                    ],
                    [
                        {
                            border: [true, true, true, true],
                            colSpan: 3,
                            alignment: "center",
                            text: this.generateColumn(
                                `MIGRACION DE PLAN\n`,
                                "header"
                            ),
                        },
                        {},
                        {},
                    ],
                ],
            },
        };
    }

    private generateColumn(text: string, style: any = null) {
        const column: any = { text };
        if (style) {
            column.style = style;
        }

        return column;
    }

    generateStyles() {
        return {
            header: {
                fontSize: 11,
                bold: true,
                margin: [0, 0, 0, 10],
            },
            subheader: {
                fontSize: 9,
                bold: true,
                margin: [0, 10, 0, 5],
            },
            normal: {
                fontSize: 9,
                margin: [0, 5, 0, 5],
            },
            tableExample: {
                margin: [0, 5, 0, 15],
            },
            tableHeader: {
                bold: true,
                fontSize: 1,
                color: "black",
            },
            subheaderOrden: {
                fontSize: 9,
                bold: true,
                margin: [0, 3, 0, 3],
            },
            normalOrden: {
                fontSize: 9,
                margin: [0, 3, 0, 3],
            },
            celdaAltoOrden: {
                fontSize: 9,
                margin: [0, 100, 0, 100],
            },
        };
    }

    generatePdf(dataFormatted: any, fileName: string) {
        const win = window.open("", "_blank");
        const docGenerated = pdfMake.createPdf(dataFormatted).print({}, win);
    }
}
