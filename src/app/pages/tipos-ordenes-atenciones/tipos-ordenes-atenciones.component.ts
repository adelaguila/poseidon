import { Component, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import {
    Procesos,
    TipoOrdenAtencionInterface,
} from "./tipo-orden-atencion.interface";
import {
    ConfirmationService,
    FilterMatchMode,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from "primeng/api";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TiposOrdenesAtencionesService } from "./tipos-ordenes-atenciones.service";
import { Util } from "src/app/utilities/util";
import { ExcelService } from "src/app/compartidos/servicios/excel.service";
import { PdfService } from "src/app/compartidos/servicios/pdf.service";
import {
    MATCHMODEOPTIONSNUMBER,
    MATCHMODEOPTIONSTEXT,
} from "src/app/compartidos/servicios/parametros-filtros-tabla";
import { ArchivoExcelInterface } from "src/app/interfaces/excel.interface";
import {
    CampoTable,
    PdfTableInterface,
} from "src/app/interfaces/pdf.interface";

@Component({
    selector: "app-tipos-ordenes-atenciones",
    templateUrl: "./tipos-ordenes-atenciones.component.html",
    styleUrls: ["./tipos-ordenes-atenciones.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class TiposOrdenesAtencionesComponent {
    @ViewChild("dt") table: Table;
    tipoOrdenAtencionDialog: boolean = false;
    totalRecords!: number;
    loading: boolean = false;
    deleteTipoOrdenAtencionDialog: boolean = false;
    tiposOrdenesAtenciones: TipoOrdenAtencionInterface[] = [];
    tipoOrdenAtencion: TipoOrdenAtencionInterface = {};
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
    tipoOrdenAtencionForm!: FormGroup;

    procesos: Procesos[] | undefined;

    constructor(
        private tiposOrdenesAtencionesService: TiposOrdenesAtencionesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private fb: FormBuilder
    ) {
        this.buildFormSector();
    }

    ngOnInit() {
        this.cols = [
            { field: "id", header: "ID" },
            { field: "nombretipoOrdenAtencion", header: "Nombre Tipo Orden" },
            { field: "proceso", header: "Proceso" },
        ];

        this.procesos = [
            { tipo: "Activar Abonado", codigo: "ACTIVAR" },
            { tipo: "Cambiar Vía", codigo: "CAMBIAR-VIA" },
            { tipo: "Cortar Abonado", codigo: "CORTAR" },
            { tipo: "General", codigo: "GENERAL" },
            { tipo: "Migrar Plan", codigo: "MIGRAR-PLAN" },
        ];

        this.matchModeOptionsText = MATCHMODEOPTIONSTEXT;
        this.matchModeOptionsNumber = MATCHMODEOPTIONSNUMBER;
        this.loading = true;
    }

    isValidField(field: string): boolean | null {
        return (
            this.tipoOrdenAtencionForm.controls[field].errors &&
            this.tipoOrdenAtencionForm.controls[field].touched
        );
    }

    getFieldError(field: string): string {
        if (!this.tipoOrdenAtencionForm.controls[field]) return null;

        const errors = this.tipoOrdenAtencionForm.controls[field].errors || {};

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

    buildFormSector() {
        this.tipoOrdenAtencionForm = this.fb.group({
            id: [0],
            nombretipoordenatencion: [
                "",
                [Validators.required, Validators.minLength(3)],
            ],
            proceso: ["", [Validators.required, Validators.minLength(3)]],
        });
    }

    loadTiposOrdenesAtenciones(event: LazyLoadEvent) {
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
        this.tiposOrdenesAtencionesService
            .getTipoOrdenAtenciones(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.tiposOrdenesAtenciones = res.data;
                this.totalRecords = res.meta.totalItems;
                this.loading = false;
            });
    }

    openNew() {
        this.tipoOrdenAtencion = {};
        this.submitted = false;
        this.tipoOrdenAtencionDialog = true;
    }

    editTipoOrdenAtencion(tipoOrdenAtencion: TipoOrdenAtencionInterface) {
        this.tipoOrdenAtencion = tipoOrdenAtencion;
        this.tipoOrdenAtencionForm.patchValue(this.tipoOrdenAtencion);
        this.tipoOrdenAtencionDialog = true;
    }

    deleteOrdenAtencion(tipoOrdenAtencion: TipoOrdenAtencionInterface) {
        this.deleteTipoOrdenAtencionDialog = true;
        this.tipoOrdenAtencion = { ...tipoOrdenAtencion };
    }

    confirmDelete() {
        this.deleteTipoOrdenAtencionDialog = false;
        this.tiposOrdenesAtencionesService
            .deleteTipoOrdenAtencion(this.tipoOrdenAtencion.id)
            .subscribe((resp) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Tipo de Orden de Atención eliminado con éxito",
                    life: 3000,
                });
                this.tipoOrdenAtencion = {};
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
        this.tipoOrdenAtencionDialog = false;
        this.submitted = false;
        this.tipoOrdenAtencionForm.reset();
    }

    saveTipoOrdenAtencion() {
        if (this.tipoOrdenAtencionForm.invalid) {
            this.tipoOrdenAtencionForm.markAllAsTouched();
            return;
        } else {
            this.tipoOrdenAtencion = this.tipoOrdenAtencionForm.value;
            this.submitted = true;
            if (this.tipoOrdenAtencion.nombretipoordenatencion?.trim()) {
                if (this.tipoOrdenAtencion.id) {
                    this.tiposOrdenesAtencionesService
                        .updateTipoOrdenAtencion(this.tipoOrdenAtencion)
                        .subscribe({
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
                                    detail: "Tipo de Orden de Atención actualizado correctamente",
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
                    this.tipoOrdenAtencion.id = 0;
                    this.tiposOrdenesAtencionesService
                        .createTipoOrdenAtencion(this.tipoOrdenAtencion)
                        .subscribe({
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
                                    detail: "Sector creado correctamente",
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
                this.tipoOrdenAtencionDialog = false;
                this.tipoOrdenAtencionForm.reset();
                this.tipoOrdenAtencion = {};
            }
        }
    }

    exportToExcel() {
        this.tiposOrdenesAtencionesService
            .getTipoOrdenAtenciones(
                this.currentPage,
                10000,
                this.sortField,
                this.sortOrder,
                this._filterPage
            )
            .subscribe((data) => {
                let dataToExcel: any[] = [];
                for (let row of data.data) {
                    let dato = [row.id, row.nombretipoordenatencion];
                    dataToExcel.push(dato);
                }

                const archivoExcel: ArchivoExcelInterface = {
                    nombre: "tiposordenesatenciones",
                    hojas: [
                        {
                            nombre: "tiposordenesatenciones",
                            cabeceraHoja: {
                                logo: true,
                                titulo: "REPORTE DE TIPOS DE ORDENES DE ATECNIONES",
                                subtitulo: `Consultado a fecha: ${new Date().toISOString()}`,
                            },
                            cabecerasColumnas: [
                                "ID",
                                "NOMBRE DE TIPO ORDEN ATENCION",
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
        this.tiposOrdenesAtencionesService
            .getTipoOrdenAtenciones(
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
                            value: row.nombretipoordenatencion,
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
                            headers: ["ID", "NOMBRE DE TIPO ORDEN DE ATENCION"],
                            rows: dataToTable,
                        },
                    },
                };
                this.pdfService.exportToPdf(
                    archivoPdf,
                    "reporte_tiposordenesatenciones",
                    "REPORTE DE TIPOS ORDENES ATECNIONES"
                );
            });
    }
}
