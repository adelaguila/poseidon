import { Component, ViewChild } from "@angular/core";
import {
    ConfirmationService,
    FilterMatchMode,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from "primeng/api";
import { Table } from "primeng/table";
import { CajanapInterface } from "./cajanap.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CajasnapService } from "./cajasnap.service";
import { Util } from "src/app/utilities/util";
import { ExcelService } from "src/app/compartidos/servicios/excel.service";
import { PdfService } from "src/app/compartidos/servicios/pdf.service";
import { ArchivoExcelInterface } from "src/app/interfaces/excel.interface";
import {
    CampoTable,
    PdfTableInterface,
} from "src/app/interfaces/pdf.interface";

@Component({
    selector: "app-cajasnap",
    templateUrl: "./cajasnap.component.html",
    styleUrls: ["./cajasnap.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class CajasnapComponent {
    @ViewChild("dt") table: Table;
    cajaDialog: boolean = false;
    totalRecords!: number;
    loading: boolean = false;
    deleteCajanapDialog: boolean = false;
    cajas: CajanapInterface[] = [];
    caja: CajanapInterface = {};
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
    cajaForm!: FormGroup;
    constructor(
        private cajasnapService: CajasnapService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private fb: FormBuilder
    ) {
        this.buildFormCajanap();
    }

    ngOnInit() {
        this.cols = [
            { field: "id", header: "ID" },
            { field: "nombrecajanap", header: "Nombre de Caja Nap" },
            { field: "ubicacion", header: "Ubicacion" },
            { field: "referencia", header: "Referencia" },
            { field: "puertos", header: "Puertos" },
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
            this.cajaForm.controls[field].errors &&
            this.cajaForm.controls[field].touched
        );
    }

    getFieldError(field: string): string {
        if (!this.cajaForm.controls[field]) return null;

        const errors = this.cajaForm.controls[field].errors || {};

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

    buildFormCajanap() {
        this.cajaForm = this.fb.group({
            id: [0],
            nombrecajanap: ["", [Validators.required, Validators.minLength(3)]],
            ubicacion: [""],
            referencia: [""],
            puertos: [1, [Validators.required]],
        });
    }

    loadCajasnap(event: LazyLoadEvent) {
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
        this.cajasnapService
            .getCajasnap(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.cajas = res.data;
                this.totalRecords = res.meta.totalItems;
                this.loading = false;
            });
    }

    openNew() {
        this.caja = {};
        this.submitted = false;
        this.cajaDialog = true;
    }

    editCajanap(caja: CajanapInterface) {
        this.caja = caja;
        this.cajaForm.patchValue(this.caja);
        this.cajaDialog = true;
    }

    deleteCajanap(caja: CajanapInterface) {
        this.deleteCajanapDialog = true;
        this.caja = { ...caja };
    }

    confirmDelete() {
        this.deleteCajanapDialog = false;
        this.cajasnapService.deleteCajanap(this.caja.id).subscribe((resp) => {
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Cajanap eliminado con éxito",
                life: 3000,
            });
            this.caja = {};
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
        this.cajaDialog = false;
        this.submitted = false;
        this.cajaForm.reset();
    }

    saveCajanap() {
        if (this.cajaForm.invalid) {
            this.cajaForm.markAllAsTouched();
            return;
        } else {
            this.caja = { ...this.cajaForm.value };
            this.submitted = true;
            if (this.caja.nombrecajanap?.trim()) {
                if (this.caja.id) {
                    this.cajasnapService.updateCajanap(this.caja).subscribe({
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
                                detail: "Cajanap actualizado correctamente",
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
                    this.caja.id = 0;
                    this.cajasnapService.createCajanap(this.caja).subscribe({
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
                                detail: "Cajanap creado correctamente",
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
                this.cajaDialog = false;
                this.cajaForm.reset();
                this.caja = {};
            }
        }
    }

    exportToExcel() {
        this.cajasnapService
            .getCajasnap(
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
                        row.nombrecajanap,
                        row.ubicacion,
                        row.referencia,
                        row.puertos,
                    ];
                    dataToExcel.push(dato);
                }

                const archivoExcel: ArchivoExcelInterface = {
                    nombre: "cajasnap",
                    hojas: [
                        {
                            nombre: "cajasnap",
                            cabeceraHoja: {
                                logo: true,
                                titulo: "REPORTE DE CAJAS NAP",
                                subtitulo: `Consultado a fecha: ${new Date().toISOString()}`,
                            },
                            cabecerasColumnas: [
                                "ID",
                                "NOMBRE DE CAJA NAP",
                                "UBICACION",
                                "REFERENCIA",
                                "PUERTOS",
                            ],
                            anchoColumnas: [20, 60, 60, 60, 20],
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
                                    horizontal: "right",
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
        this.cajasnapService
            .getCajasnap(
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
                            value: row.nombrecajanap,
                            alignment: "left",
                        },
                        {
                            value: row.ubicacion,
                            alignment: "left",
                        },
                        {
                            value: row.referencia,
                            alignment: "left",
                        },
                        {
                            value: row.puertos,
                            alignment: "center",
                        },
                    ];
                    dataToTable.push(dato);
                }
                const archivoPdf: PdfTableInterface = {
                    layout: "", //'lightHorizontalLines',
                    table: {
                        headerRow: 1,
                        widths: [50, "auto", "auto", "auto", 50],
                        body: {
                            headers: [
                                "ID",
                                "NOMBRE DE CAJA NAP",
                                "UBICACION",
                                "REFERENCIA",
                                "PUERTOS",
                            ],
                            rows: dataToTable,
                        },
                    },
                };
                this.pdfService.exportToPdf(
                    archivoPdf,
                    "reporte_cajasnap",
                    "REPORTE DE CAJAS NAP"
                );
            });
    }
}
