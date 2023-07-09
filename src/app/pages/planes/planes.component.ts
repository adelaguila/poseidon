import { Component, ViewChild } from "@angular/core";
import { PlanInterface } from "./plan.interface";
import {
    ConfirmationService,
    FilterMatchMode,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from "primeng/api";
import { PlanesService } from "./planes.service";
import { Table } from "primeng/table";
import { Util } from "src/app/utilities/util";
import { ExcelService } from "src/app/compartidos/servicios/excel.service";
import { PdfService } from "src/app/compartidos/servicios/pdf.service";
import { ArchivoExcelInterface } from "src/app/interfaces/excel.interface";
import {
    CampoTable,
    PdfTableInterface,
} from "src/app/interfaces/pdf.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-planes",
    templateUrl: "./planes.component.html",
    styleUrls: ["./planes.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class PlanesComponent {
    @ViewChild("dt") table: Table;
    planDialog: boolean = false;
    totalRecords!: number;
    loading: boolean = false;
    deletePlanDialog: boolean = false;
    planes: PlanInterface[] = [];
    plan: PlanInterface = {};
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
    planForm!: FormGroup;
    constructor(
        private planesService: PlanesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private fb: FormBuilder
    ) {
        this.buildFormPlan();
    }

    ngOnInit() {
        this.cols = [
            { field: "id", header: "ID" },
            { field: "nombreplan", header: "Nombre del Plan" },
            { field: "preciodia", header: "Precio x Día" },
            { field: "precioperiodo", header: "Precio x Periodo" },
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
            this.planForm.controls[field].errors &&
            this.planForm.controls[field].touched
        );
    }

    getFieldError(field: string): string {
        if (!this.planForm.controls[field]) return null;

        const errors = this.planForm.controls[field].errors || {};

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

    buildFormPlan() {
        this.planForm = this.fb.group({
            id: [0],
            nombreplan: ["", [Validators.required, Validators.minLength(3)]],
            preciodia: [1, [Validators.required, Validators.min(1)]],
            precioperiodo: [1, [Validators.required, Validators.min(1)]],
            isActive: [true],
        });
    }

    loadPlanes(event: LazyLoadEvent) {
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
        this.planesService
            .getPlanes(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.planes = res.data;
                this.totalRecords = res.meta.totalItems;
                this.loading = false;
            });
    }

    openNew() {
        this.plan = {};
        this.submitted = false;
        this.planDialog = true;
    }

    editPlan(plan: PlanInterface) {
        this.plan = plan;
        this.planForm.patchValue(this.plan);
        this.planDialog = true;
    }

    deletePlan(plan: PlanInterface) {
        this.deletePlanDialog = true;
        this.plan = { ...plan };
    }

    confirmDelete() {
        this.deletePlanDialog = false;
        this.planesService.deletePlan(this.plan.id).subscribe((resp) => {
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Plan eliminado con éxito",
                life: 3000,
            });
            this.plan = {};
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
        this.planDialog = false;
        this.submitted = false;
        this.planForm.reset();
    }

    savePlan() {
        if (this.planForm.invalid) {
            this.planForm.markAllAsTouched();
            return;
        } else {
            this.plan = { ...this.planForm.value };
            this.submitted = true;
            if (this.plan.nombreplan?.trim()) {
                if (this.plan.id) {
                    this.planesService.updatePlan(this.plan).subscribe({
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
                                detail: "Plan actualizado correctamente",
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
                    this.plan.id = 0;
                    this.planesService.createPlan(this.plan).subscribe({
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
                                detail: "Plan creado correctamente",
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
                this.planDialog = false;
                this.planForm.reset();
                this.plan = {};
            }
        }
    }

    exportToExcel() {
        this.planesService
            .getPlanes(
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
                        row.nombreplan,
                        row.preciodia,
                        row.precioperiodo,
                        row.isActive,
                    ];
                    dataToExcel.push(dato);
                }

                const archivoExcel: ArchivoExcelInterface = {
                    nombre: "planes",
                    hojas: [
                        {
                            nombre: "planes",
                            cabeceraHoja: {
                                logo: true,
                                titulo: "REPORTE DE PLANES",
                                subtitulo: `Consultado a fecha: ${new Date().toISOString()}`,
                            },
                            cabecerasColumnas: [
                                "ID",
                                "NOMBRE DEL PLAN",
                                "PRECIO X MES",
                                "PRECIO X PERIODO",
                                "ESTADO",
                            ],
                            anchoColumnas: [20, 60, 20, 20, 20],
                            alineacionColumnas: [
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "left",
                                },
                                {
                                    horizontal: "right",
                                },
                                {
                                    horizontal: "right",
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
        this.planesService
            .getPlanes(
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
                            value: row.nombreplan,
                            alignment: "left",
                        },
                        {
                            value: row.preciodia,
                            alignment: "right",
                        },
                        {
                            value: row.precioperiodo,
                            alignment: "right",
                        },
                        {
                            value: row.isActive,
                            alignment: "center",
                        },
                    ];
                    dataToTable.push(dato);
                }
                const archivoPdf: PdfTableInterface = {
                    layout: "", //'lightHorizontalLines',
                    table: {
                        headerRow: 1,
                        widths: [50, "*", 50, 50, 50],
                        body: {
                            headers: [
                                "ID",
                                "NOMBRE DEL PLAN",
                                "PRECIO X DIA",
                                "PRECIO X PERIODO",
                                "ESTADO",
                            ],
                            rows: dataToTable,
                        },
                    },
                };
                this.pdfService.exportToPdf(
                    archivoPdf,
                    "reporte_planes",
                    "REPORTE DE PLANES"
                );
            });
    }
}
