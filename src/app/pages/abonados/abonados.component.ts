import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, FilterMatchMode, LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AbonadoInterface } from './abonado.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbonadosService } from './abonados.service';
import { Util } from 'src/app/utilities/util';
import { ExcelService } from 'src/app/compartidos/servicios/excel.service';
import { PdfService } from 'src/app/compartidos/servicios/pdf.service';
import { ArchivoExcelInterface } from 'src/app/interfaces/excel.interface';
import { CampoTable, PdfTableInterface } from 'src/app/interfaces/pdf.interface';

@Component({
  selector: 'app-abonados',
  templateUrl: './abonados.component.html',
  styleUrls: ['./abonados.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class AbonadosComponent {
    @ViewChild("dt") table: Table;
    abonadoDialog: boolean = false;
    totalRecords!: number;
    loading: boolean = false;
    deleteAbonadoDialog: boolean = false;
    abonados: AbonadoInterface[] = [];
    abonado: AbonadoInterface = {};
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [10, 20, 50, 100, 500];
    rows = 10;
    currentPage = 1;
    _filterPage: any = "";
    sortField: string;
    sortOrder: string;

    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];
    abonadoForm!: FormGroup;
    constructor(
        private abonadosService: AbonadosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private fb: FormBuilder
    ) {
        this.buildFormAbonado();
    }

    ngOnInit() {
        this.cols = [
            { field: "id", header: "ID" },
            { field: "numerodoi", header: "Nombre del Abonado" },
            { field: "nombretercero", header: "Nombre del Abonado" },
            { field: "nombresector", header: "Nombre del Abonado" },
            { field: "nombrevia", header: "Nombre del Abonado" },
            { field: "nombrevia", header: "Nombre del Abonado" },
            { field: "numero", header: "Nombre del Abonado" },
            { field: "referencia", header: "Nombre del Abonado" },
            { field: "nombreplan", header: "Nombre del Abonado" },
            { field: "nombrecajanap", header: "Nombre del Abonado" },
            { field: "fecharegistro", header: "Nombre del Abonado" },
            { field: "fechaactivacion", header: "Nombre del Abonado" },
            { field: "fechaultimaliquidacion", header: "Nombre del Abonado" },
            { field: "estado", header: "Nombre del Abonado" },
        ];

        this.matchModeOptionsText = [
            { label: "Comienza con", value: FilterMatchMode.STARTS_WITH },
            { label: "Contiene", value: FilterMatchMode.CONTAINS },
            { label: "Es igual", value: FilterMatchMode.EQUALS },
        ];
        this.matchModeOptionsNumber = [
            { label: "Comienza con", value: FilterMatchMode.STARTS_WITH },
            { label: "Contiene", value: FilterMatchMode.CONTAINS },
            { label: "Es igual", value: FilterMatchMode.EQUALS },
            { label: "Menor que", value: FilterMatchMode.LESS_THAN },
            {
                label: "Menor o igual que",
                value: FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
            },
            { label: "Mayor que", value: FilterMatchMode.GREATER_THAN },
            {
                label: "Mayor o igual que",
                value: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
            },
        ];

        this.loading = true;
    }

    isValidField(field: string): boolean | null {
        return (
            this.abonadoForm.controls[field].errors &&
            this.abonadoForm.controls[field].touched
        );
    }

    getFieldError(field: string): string {
        if (!this.abonadoForm.controls[field]) return null;

        const errors = this.abonadoForm.controls[field].errors || {};

        for (const key of Object.keys(errors)) {
            console.log(key);
            switch (key) {
                case "required":
                    return "Este campo es requerido";
                case "minlength":
                    return `El campo debe tener mínimo ${errors["minlength"].requiredLength} caracteres`;
            }
        }
        return null;
    }

    buildFormAbonado() {
        this.abonadoForm = this.fb.group({
            id: [0],
            tipodoi: ["01", [Validators.required]],
            numerodoi: [
                "",
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(11),
                ],
            ],
            nombretercero: ["", [Validators.required, Validators.minLength(3)]],
            direccion: ["", [Validators.required, Validators.minLength(3)]],
            ubigeo: ["", [Validators.required]],
            correo: [""],
            telefono: [""],
            sector: ["", [Validators.required]],
            via: ["", [Validators.required]],
            numero: ["", [Validators.required]],
            referencia: [""],
            plan: ["", [Validators.required]],
            cajanap: ["", [Validators.required]],
            fecharegistro: ["", [Validators.required]],
        });
    }

    loadAbonados(event: LazyLoadEvent) {
        this.rows = event.rows;
        this.sortField = event.sortField;
        if (event.sortOrder == 1) {
            this.sortOrder = "ASC";
        } else {
            this.sortOrder = "DESC";
        }
        if (event.first == 0) {
            this.currentPage = 1;
        } else {
            this.currentPage = event.first / event.rows + 1;
        }
        this._filterPage = this.util.NestJsonFilter(event.filters);

        this.loading = true;

        this.getPage(
            this.currentPage,
            this.rows,
            this.sortField,
            this.sortOrder,
            this._filterPage
        );
    }

    getPage(
        page?: number,
        rows?: number,
        sortField?: string,
        sortOrder?: string,
        filter?: any
    ) {
        this.abonadosService
            .getAbonados(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.abonados = res.data;
                this.totalRecords = res.meta.totalItems;
                this.loading = false;
            });
    }

    openNew() {
        this.abonado = {};
        this.submitted = false;
        this.abonadoDialog = true;
    }

    editAbonado(abonado: AbonadoInterface) {
        this.abonado = abonado ;
        this.abonadoForm.patchValue(this.abonado);
        this.abonadoDialog = true;
    }

    deleteAbonado(abonado: AbonadoInterface) {
        this.deleteAbonadoDialog = true;
        this.abonado = { ...abonado };
    }

    confirmDelete() {
        this.deleteAbonadoDialog = false;
        this.abonadosService.deleteAbonado(this.abonado.id).subscribe((resp) => {
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Abonado eliminado con éxito",
                life: 3000,
            });
            this.abonado = {};
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });
    }

    hideDialog() {
        this.abonadoDialog = false;
        this.submitted = false;
        this.abonadoForm.reset();
    }

    saveAbonado() {
        if (this.abonadoForm.invalid) {
            this.abonadoForm.markAllAsTouched();
            return;
        } else {
            this.abonado = this.abonadoForm.value;
            this.submitted = true;
            if (this.abonado.tercero.nombretercero?.trim()) {
                if (this.abonado.id) {
                    this.abonadosService.updateAbonado(this.abonado).subscribe({
                        next: () => {
                            this.getPage(
                                this.currentPage,
                                this.rows,
                                this.sortField,
                                this.sortOrder,
                                this._filterPage
                            );
                            this.messageService.add({
                                severity: "success",
                                summary: "Successful",
                                detail: "Abonado actualizado correctamente",
                                life: 3000,
                            });
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Error",
                                detail: "Algo salió mal, no se guardaron los cambios",
                                life: 3000,
                            });
                        },
                    });
                } else {
                    this.abonado.id = 0;
                    this.abonadosService.createAbonado(this.abonado).subscribe({
                        next: () => {
                            this.getPage(
                                this.currentPage,
                                this.rows,
                                this.sortField,
                                this.sortOrder,
                                this._filterPage
                            );
                            this.messageService.add({
                                severity: "success",
                                summary: "Successful",
                                detail: "Abonado creado correctamente",
                                life: 3000,
                            });
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Error",
                                detail: "Algo salió mal, no se guardaron los cambios",
                                life: 3000,
                            });
                        },
                    });
                }
                this.abonadoDialog = false;
                this.abonadoForm.reset();
                this.abonado = {};
            }
        }
    }

    exportToExcel() {
        this.abonadosService
            .getAbonados(
                this.currentPage,
                10000,
                this.sortField,
                this.sortOrder,
                this._filterPage
            )
            .subscribe((data) => {
                let dataToExcel: any[] = [];
                for (let row of data.data) {
                    let dato = [
                        row.id,
                        row.tercero.numerodoi,
                        row.tercero.nombretercero,
                        row.sector.nombresector,
                        row.via.nombrevia,
                        row.numero,
                        row.referencia,
                        row.plan.nombreplan,
                        row.cajanap.nombrecajanap,
                        row.estado,
                    ];
                    dataToExcel.push(dato);
                }

                const archivoExcel: ArchivoExcelInterface = {
                    nombre: "abonados",
                    hojas: [
                        {
                            nombre: "abonados",
                            cabeceraHoja: {
                                logo: true,
                                titulo: "REPORTE DE ABONADOS",
                                subtitulo: `Consultado a fecha: ${new Date().toISOString()}`,
                            },
                            cabecerasColumnas: [
                                "ID",
                                "NUMERO DOI",
                                "NOMBRE DE ABONADO",
                                "SECTOR",
                                "VIA",
                                "NUMERO",
                                "REFERENCIA",
                                "PLAN",
                                "CAJA NAP",
                                "ESTADO",
                            ],
                            anchoColumnas: [20, 40, 60, 50, 50, 40, 50, 50, 50, 20],
                            alineacionColumnas: [
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                            ],
                            dataColumnas: dataToExcel,
                        },
                    ],
                };
                this.excelService.dowloadExcel(archivoExcel);
            });
    }

    exportToPdf() {
        this.abonadosService
            .getAbonados(
                this.currentPage,
                10000,
                this.sortField,
                this.sortOrder,
                this._filterPage
            )
            .subscribe((data) => {
                let dataToTable: any[] = [];
                for (let row of data.data) {
                    let dato: CampoTable[] = [
                        {
                            value: row.id,
                            alignment: "center",
                        },
                        {
                            value: row.tercero.numerodoi,
                            alignment: "left",
                        },
                        {
                            value: row.tercero.nombretercero,
                            alignment: "left",
                        },
                        {
                            value: row.sector.nombresector,
                            alignment: "left",
                        },
                        {
                            value: row.via.nombrevia,
                            alignment: "left",
                        },
                        {
                            value: row.numero,
                            alignment: "left",
                        },
                        {
                            value: row.referencia,
                            alignment: "left",
                        },
                        {
                            value: row.plan.nombreplan,
                            alignment: "left",
                        },
                        {
                            value: row.cajanap.nombrecajanap,
                            alignment: "left",
                        },
                        {
                            value: row.estado,
                            alignment: "left",
                        },
                    ];
                    dataToTable.push(dato);
                }
                const archivoPdf: PdfTableInterface = {
                    layout: "", //'lightHorizontalLines',
                    table: {
                        headerRow: 1,
                        widths: [50, "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
                        body: {
                            headers: [
                                "ID",
                                "NUMERO DOI",
                                "NOMBRE ABONADO",
                                "SECTOR",
                                "VIA",
                                "NUMERO",
                                "REFERENCIA",
                                "PLAN",
                                "CAJA NAP",
                                "ESTADO",
                            ],
                            rows: dataToTable,
                        },
                    },
                };
                this.pdfService.exportToPdf(
                    archivoPdf,
                    "reporte_abonados",
                    "REPORTE DE VIAS",
                    "A4",
                    "landscape",
                );
            });
    }
}
