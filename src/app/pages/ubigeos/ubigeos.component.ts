import { Component, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { UbigeoInterface } from "./ubigeo.interface";
import { UbigeosService } from "./ubigeos.service";
import {
    ConfirmationService,
    FilterMatchMode,
    FilterService,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from "primeng/api";
import { Util } from "src/app/utilities/util";
import { ArchivoExcelInterface } from "src/app/interfaces/excel.interface";
import { ExcelService } from "src/app/compartidos/servicios/excel.service";
import { PdfService } from "src/app/compartidos/servicios/pdf.service";
import {
    CampoTable,
    PdfTableInterface,
} from "src/app/interfaces/pdf.interface";

@Component({
    selector: "app-ubigeos",
    templateUrl: "./ubigeos.component.html",
    styleUrls: ["./ubigeos.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class UbigeosComponent {
    @ViewChild("dt") table: Table;
    ubigeoDialog: boolean = false;
    totalRecords!: number;
    loading: boolean = false;
    selectAll: boolean = false;
    deleteUbigeoDialog: boolean = false;
    deleteUbigeosDialog: boolean = false;
    ubigeos: UbigeoInterface[] = [];
    ubigeo: UbigeoInterface = {};
    selectedUbigeos: UbigeoInterface[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [10, 20, 50, 100];
    rows = 10;
    currentPage = 1;
    _filterPage: any = "";
    sortField: string;
    sortOrder: string;

    matchModeOptions: SelectItem[];

    constructor(
        private ubigeosService: UbigeosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util,
        private excelService: ExcelService,
        private pdfService: PdfService
    ) {}

    ngOnInit() {
        this.cols = [
            { field: "id", header: "ID" },
            { field: "codigo", header: "Codigo" },
            { field: "departamento", header: "Departamento" },
            { field: "provincia", header: "Provincia" },
            { field: "distrito", header: "Distrito" },
        ];

        this.matchModeOptions = [
            { label: "Comienza con", value: FilterMatchMode.STARTS_WITH },
            { label: "Contiene", value: FilterMatchMode.CONTAINS },
            { label: "Es igual", value: FilterMatchMode.EQUALS },
        ];
        this.loading = true;
    }

    loadUbigeos(event: LazyLoadEvent) {
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
        this.ubigeosService
            .getUbigeos(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.ubigeos = res.data;
                this.totalRecords = res.meta.totalItems;
                this.loading = false;
            });
    }

    onSelectionChange(value = []) {
        this.selectAll = value.length === this.totalRecords;
        this.selectedUbigeos = value;
    }

    onSelectAllChange(event: any) {
        const checked = event.checked;
        if (checked) {
            this.ubigeosService
                .getUbigeos(
                    this.currentPage,
                    this.rows,
                    this.sortField,
                    this.sortOrder,
                    this._filterPage
                )
                .subscribe((res) => {
                    this.selectedUbigeos = res.data;
                    this.selectAll = true;
                });
        } else {
            this.selectedUbigeos = [];
            this.selectAll = false;
        }
    }

    openNew() {
        this.ubigeo = {};
        this.submitted = false;
        this.ubigeoDialog = true;
    }

    deleteSelectedUbigeos() {
        this.deleteUbigeosDialog = true;
    }

    editUbigeo(ubigeo: UbigeoInterface) {
        this.ubigeo = { ...ubigeo };
        this.ubigeoDialog = true;
    }

    deleteUbigeo(ubigeo: UbigeoInterface) {
        this.deleteUbigeoDialog = true;
        this.ubigeo = { ...ubigeo };
    }

    confirmDeleteSelected() {
        this.deleteUbigeosDialog = false;
        this.ubigeos = this.ubigeos.filter(
            (val) => !this.selectedUbigeos.includes(val)
        );
        this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Usuarios Deleted",
            life: 3000,
        });
        this.selectedUbigeos = [];
    }

    confirmDelete() {
        this.deleteUbigeoDialog = false;
        this.ubigeosService.deleteUbigeo(this.ubigeo.id).subscribe((resp) => {
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Ubigeo eliminado con éxito",
                life: 3000,
            });
            this.ubigeo = {};
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
        this.ubigeoDialog = false;
        this.submitted = false;
    }

    saveUbigeo() {
        console.log(this.ubigeo);
        this.submitted = true;

        if (this.ubigeo.codigo?.trim()) {
            if (this.ubigeo.id) {
                this.ubigeosService.updateUbigeo(this.ubigeo).subscribe({
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
                            detail: "Ubigeo actualizado correctamente",
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
                this.ubigeo.id = 0;
                this.ubigeosService.createUbigeo(this.ubigeo).subscribe({
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
                            detail: "Ubigeo creado correctamente",
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
            this.ubigeoDialog = false;
            this.ubigeo = {};
        }
    }

    exportToExcel() {
        this.ubigeosService
            .getUbigeos(
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
                        row.codigo,
                        row.departamento,
                        row.provincia,
                        row.distrito,
                    ];
                    dataToExcel.push(dato);
                }

                const archivoExcel: ArchivoExcelInterface = {
                    nombre: "ubigeos",
                    hojas: [
                        {
                            nombre: "ubigeos",
                            cabeceraHoja: {
                                logo: true,
                                titulo: "REPORTE DE UBIGEOS",
                                subtitulo: `Consultado a fecha: ${new Date().toISOString()}`,
                            },
                            cabecerasColumnas: [
                                "ID",
                                "CODIGO",
                                "DEPARTAMENTO",
                                "PROVINCIA",
                                "DISTRITO",
                            ],
                            anchoColumnas: [20, 20, 50, 50, 50],
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
                            ],
                            dataColumnas: dataToExcel,
                        },
                    ],
                };
                this.excelService.dowloadExcel(archivoExcel);
            });
    }

    exportToPdf() {
        this.ubigeosService
            .getUbigeos(
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
                            value: row.codigo,
                            alignment: "center",
                        },
                        {
                            value: row.departamento,
                            alignment: "left",
                        },
                        {
                            value: row.provincia,
                            alignment: "left",
                        },
                        {
                            value: row.distrito,
                            alignment: "left",
                        },
                    ];
                    dataToTable.push(dato);
                }
                const archivoPdf: PdfTableInterface = {
                    layout: "", //'lightHorizontalLines',
                    table: {
                        headerRow: 1,
                        widths: [50, 50, "*", "*", "*"],
                        body: {
                            headers: [
                                "ID",
                                "CODIGO",
                                "DEPARTAMENTO",
                                "PROVINCIA",
                                "DISTRITO",
                            ],
                            rows: dataToTable,
                        },
                    },
                };
                this.pdfService.exportToPdf(
                    archivoPdf,
                    "reporte_ubigeos",
                    "REPORTE DE UBIGEOS"
                );
            });
    }
}
