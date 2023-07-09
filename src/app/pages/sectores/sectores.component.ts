import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, FilterMatchMode, LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { SectorInterface } from './sector.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SectoresService } from './sectores.service';
import { Util } from 'src/app/utilities/util';
import { ExcelService } from 'src/app/compartidos/servicios/excel.service';
import { PdfService } from 'src/app/compartidos/servicios/pdf.service';
import { ArchivoExcelInterface } from 'src/app/interfaces/excel.interface';
import { CampoTable, PdfTableInterface } from 'src/app/interfaces/pdf.interface';

@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class SectoresComponent {
    @ViewChild("dt") table: Table;
    sectorDialog: boolean = false;
    totalRecords!: number;
    loading: boolean = false;
    deleteSectorDialog: boolean = false;
    sectores: SectorInterface[] = [];
    sector: SectorInterface = {};
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
    sectorForm!: FormGroup;
    constructor(
        private sectoresService: SectoresService,
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
            { field: "nombresector", header: "Nombre del Sector" },
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
            this.sectorForm.controls[field].errors &&
            this.sectorForm.controls[field].touched
        );
    }

    getFieldError(field: string): string {
        if (!this.sectorForm.controls[field]) return null;

        const errors = this.sectorForm.controls[field].errors || {};

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
        this.sectorForm = this.fb.group({
            id: [0],
            nombresector: ["", [Validators.required, Validators.minLength(3)]],
        });
    }

    loadSectores(event: LazyLoadEvent) {
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
        this.sectoresService
            .getSectores(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.sectores = res.data;
                this.totalRecords = res.meta.totalItems;
                this.loading = false;
            });
    }

    openNew() {
        this.sector = {};
        this.submitted = false;
        this.sectorDialog = true;
    }

    editSector(sector: SectorInterface) {
        this.sector = sector ;
        this.sectorForm.patchValue(this.sector);
        this.sectorDialog = true;
    }

    deleteSector(sector: SectorInterface) {
        this.deleteSectorDialog = true;
        this.sector = { ...sector };
    }

    confirmDelete() {
        this.deleteSectorDialog = false;
        this.sectoresService.deleteSector(this.sector.id).subscribe((resp) => {
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Sector eliminado con éxito",
                life: 3000,
            });
            this.sector = {};
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
        this.sectorDialog = false;
        this.submitted = false;
        this.sectorForm.reset();
    }

    saveSector() {
        if (this.sectorForm.invalid) {
            this.sectorForm.markAllAsTouched();
            return;
        } else {
            this.sector = this.sectorForm.value;
            this.submitted = true;
            if (this.sector.nombresector?.trim()) {
                if (this.sector.id) {
                    this.sectoresService.updateSector(this.sector).subscribe({
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
                                detail: "Sector actualizado correctamente",
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
                    this.sector.id = 0;
                    this.sectoresService.createSector(this.sector).subscribe({
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
                this.sectorDialog = false;
                this.sectorForm.reset();
                this.sector = {};
            }
        }
    }

    exportToExcel() {
        this.sectoresService
            .getSectores(
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
                        row.nombresector,
                        row.preciodia,
                        row.precioperiodo,
                        row.isActive,
                    ];
                    dataToExcel.push(dato);
                }

                const archivoExcel: ArchivoExcelInterface = {
                    nombre: "sectores",
                    hojas: [
                        {
                            nombre: "sectores",
                            cabeceraHoja: {
                                logo: true,
                                titulo: "REPORTE DE SECTORES",
                                subtitulo: `Consultado a fecha: ${new Date().toISOString()}`,
                            },
                            cabecerasColumnas: [
                                "ID",
                                "NOMBRE DE SECTOR",
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
        this.sectoresService
            .getSectores(
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
                            value: row.nombresector,
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
                                "NOMBRE DE SECTOR",
                            ],
                            rows: dataToTable,
                        },
                    },
                };
                this.pdfService.exportToPdf(
                    archivoPdf,
                    "reporte_sectores",
                    "REPORTE DE SECTORES"
                );
            });
    }
}
