import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, FilterMatchMode, LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ViaInterface } from './via.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViasService } from './vias.service';
import { Util } from 'src/app/utilities/util';
import { ExcelService } from 'src/app/compartidos/servicios/excel.service';
import { PdfService } from 'src/app/compartidos/servicios/pdf.service';
import { ArchivoExcelInterface } from 'src/app/interfaces/excel.interface';
import { CampoTable, PdfTableInterface } from 'src/app/interfaces/pdf.interface';

@Component({
  selector: 'app-vias',
  templateUrl: './vias.component.html',
  styleUrls: ['./vias.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ViasComponent {
    @ViewChild("dt") table: Table;
    viaDialog: boolean = false;
    totalRecords!: number;
    loading: boolean = false;
    deleteViaDialog: boolean = false;
    vias: ViaInterface[] = [];
    via: ViaInterface = {};
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [10, 20, 50, 100];
    rows = 10;
    currentPage = 1;
    _filterPage: any = "";
    sortField: string;
    sortOrder: string;

    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];
    viaForm!: FormGroup;
    constructor(
        private viasService: ViasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private fb: FormBuilder
    ) {
        this.buildFormVia();
    }

    ngOnInit() {
        this.cols = [
            { field: "id", header: "ID" },
            { field: "nombrevia", header: "Nombre del Via" },
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
            this.viaForm.controls[field].errors &&
            this.viaForm.controls[field].touched
        );
    }

    getFieldError(field: string): string {
        if (!this.viaForm.controls[field]) return null;

        const errors = this.viaForm.controls[field].errors || {};

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

    buildFormVia() {
        this.viaForm = this.fb.group({
            id: [0],
            nombrevia: ["", [Validators.required, Validators.minLength(3)]],
        });
    }

    loadVias(event: LazyLoadEvent) {
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
        this.viasService
            .getVias(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.vias = res.data;
                this.totalRecords = res.meta.totalItems;
                this.loading = false;
            });
    }

    openNew() {
        this.via = {};
        this.submitted = false;
        this.viaDialog = true;
    }

    editVia(via: ViaInterface) {
        this.via = via ;
        this.viaForm.patchValue(this.via);
        this.viaDialog = true;
    }

    deleteVia(via: ViaInterface) {
        this.deleteViaDialog = true;
        this.via = { ...via };
    }

    confirmDelete() {
        this.deleteViaDialog = false;
        this.viasService.deleteVia(this.via.id).subscribe((resp) => {
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Via eliminado con éxito",
                life: 3000,
            });
            this.via = {};
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
        this.viaDialog = false;
        this.submitted = false;
        this.viaForm.reset();
    }

    saveVia() {
        if (this.viaForm.invalid) {
            this.viaForm.markAllAsTouched();
            return;
        } else {
            this.via = this.viaForm.value;
            this.submitted = true;
            if (this.via.nombrevia?.trim()) {
                if (this.via.id) {
                    this.viasService.updateVia(this.via).subscribe({
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
                                detail: "Via actualizado correctamente",
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
                    this.via.id = 0;
                    this.viasService.createVia(this.via).subscribe({
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
                                detail: "Via creado correctamente",
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
                this.viaDialog = false;
                this.viaForm.reset();
                this.via = {};
            }
        }
    }

    exportToExcel() {
        this.viasService
            .getVias(
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
                        row.nombrevia,
                        row.preciodia,
                        row.precioperiodo,
                        row.isActive,
                    ];
                    dataToExcel.push(dato);
                }

                const archivoExcel: ArchivoExcelInterface = {
                    nombre: "vias",
                    hojas: [
                        {
                            nombre: "vias",
                            cabeceraHoja: {
                                logo: true,
                                titulo: "REPORTE DE VIAS",
                                subtitulo: `Consultado a fecha: ${new Date().toISOString()}`,
                            },
                            cabecerasColumnas: [
                                "ID",
                                "NOMBRE DE VIA",
                            ],
                            anchoColumnas: [20, 60],
                            alineacionColumnas: [
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
        this.viasService
            .getVias(
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
                            value: row.nombrevia,
                            alignment: "left",
                        },
                    ];
                    dataToTable.push(dato);
                }
                const archivoPdf: PdfTableInterface = {
                    layout: "", //'lightHorizontalLines',
                    table: {
                        headerRow: 1,
                        widths: [50, "*"],
                        body: {
                            headers: [
                                "ID",
                                "NOMBRE DE VIA",
                            ],
                            rows: dataToTable,
                        },
                    },
                };
                this.pdfService.exportToPdf(
                    archivoPdf,
                    "reporte_vias",
                    "REPORTE DE VIAS"
                );
            });
    }
}
