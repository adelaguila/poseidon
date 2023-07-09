import { Component, ViewChild } from "@angular/core";
import { TerceroInterface, TipoDoi } from "./tercero.interface";
import { Table } from "primeng/table";
import {
    ConfirmationService,
    FilterMatchMode,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from "primeng/api";
import { TercerosService } from "./terceros.service";
import { Util } from "src/app/utilities/util";
import { ExcelService } from "src/app/compartidos/servicios/excel.service";
import { PdfService } from "src/app/compartidos/servicios/pdf.service";
import { ArchivoExcelInterface } from "src/app/interfaces/excel.interface";
import {
    CampoTable,
    PdfTableInterface,
} from "src/app/interfaces/pdf.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UbigeosService } from "../ubigeos/ubigeos.service";
import { ApimigoService } from "src/app/compartidos/servicios/apimigo.service";
import { UbigeoInterface } from "../ubigeos/ubigeo.interface";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-terceros",
    templateUrl: "./terceros.component.html",
    styleUrls: ["./terceros.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class TercerosComponent {
    @ViewChild("dt") table: Table;
    terceroDialog: boolean = false;
    totalRecords!: number;
    loading: boolean = false;
    selectAll: boolean = false;
    deleteTerceroDialog: boolean = false;
    deleteTercerosDialog: boolean = false;
    terceros: TerceroInterface[] = [];
    tercero: TerceroInterface = {};
    selectedTerceros: TerceroInterface[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [10, 20, 50, 100];
    rows = 10;
    currentPage = 1;
    _filterPage: any = "";
    sortField: string;
    sortOrder: string;

    matchModeOptions: SelectItem[];

    tiposDoi: TipoDoi[] | undefined;
    terceroForm!: FormGroup;
    ubigeosFiltrados = [];

    constructor(
        private tercerosService: TercerosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private fb: FormBuilder,
        private ubigeosService: UbigeosService,
        private apimigoService: ApimigoService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.buildFormTercero();
    }

    ngOnInit() {
        this.cols = [
            { field: "id", header: "ID" },
            { field: "numerodoi", header: "Numero DOI" },
            { field: "nombretercero", header: "Nombre / Razón Social" },
            { field: "correo", header: "Correo" },
            { field: "telefono", header: "Teléfono" },
            { field: "direcciones.direccion", header: "Dirección" },
        ];

        this.matchModeOptions = [
            { label: "Comienza con", value: FilterMatchMode.STARTS_WITH },
            { label: "Contiene", value: FilterMatchMode.CONTAINS },
            { label: "Es igual", value: FilterMatchMode.EQUALS },
        ];

        this.tiposDoi = [
            { tipo: "DNI", codigo: "01" },
            { tipo: "RUC", codigo: "06" },
        ];

        this.loading = true;
    }

    isValidField(field: string): boolean | null {
        return (
            this.terceroForm.controls[field].errors &&
            this.terceroForm.controls[field].touched
        );
    }

    getFieldError(field: string): string {
        if (!this.terceroForm.controls[field]) return null;

        const errors = this.terceroForm.controls[field].errors || {};

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

    buildFormTercero() {
        this.terceroForm = this.fb.group({
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
        });
    }

    loadTerceros(event: LazyLoadEvent) {
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
        this.tercerosService
            .getTerceros(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.terceros = res.data;
                this.totalRecords = res.meta.totalItems;
                this.loading = false;
            });
    }

    filtrarUbigeos(event: any) {
        console.log(event);
        this.ubigeosService
            .autocompleteUbigeo(event.query)
            .subscribe((result) => {
                this.ubigeosFiltrados = result;
            });
    }

    openNew() {
        this.tercero = {};
        this.submitted = false;
        this.terceroDialog = true;
    }

    editTercero(tercero: TerceroInterface) {
        this.router.navigate(["actualizar", tercero.id], {
            relativeTo: this.route,
        });
    }

    deleteTercero(tercero: TerceroInterface) {
        this.deleteTerceroDialog = true;
        this.tercero = { ...tercero };
    }

    confirmDelete() {
        this.deleteTerceroDialog = false;
        this.tercerosService
            .deleteTercero(this.tercero.id)
            .subscribe((resp) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Cliente / Proveedor eliminado con éxito",
                    life: 3000,
                });
                this.tercero = {};
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
        this.terceroDialog = false;
        this.submitted = false;
    }

    saveTercero() {
        if (this.terceroForm.invalid) {
            this.terceroForm.markAllAsTouched();
            return;
        } else {
            this.tercero = this.terceroForm.value;
            this.submitted = true;
            let datos: any = {
                id: this.tercero.id,
                tipodoi: this.tercero.tipodoi,
                numerodoi: this.tercero.numerodoi,
                nombretercero: this.tercero.nombretercero,
                correo: this.tercero.correo,
                telefono: this.tercero.telefono,
                direccion: this.tercero.direccion,
                ubigeoId: this.tercero.ubigeo.id,
            };
            if (this.tercero.id == 0) {
                this.tercerosService.createTercero(datos).subscribe({
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
                            detail: "Cliente / Proveedor creado correctamente",
                            life: 3000,
                        });
                        this.terceroDialog = false;
                        this.terceroForm.reset({ id: 0 });
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
        }
    }

    buscarMigo() {
        this.tercero = this.terceroForm.value;
        this.tercerosService
            .getByDoi(this.tercero.numerodoi)
            .subscribe((resp: any) => {
                if (resp.statusCode === 404) {
                    if (
                        this.tercero.tipodoi == "01" &&
                        this.tercero.numerodoi.length == 8
                    ) {
                        this.apimigoService
                            .consultarDNI(this.tercero.numerodoi)
                            .then((resp) => {
                                this.terceroForm.controls[
                                    "nombretercero"
                                ].setValue(resp.nombre);
                            });
                    } else if (
                        this.tercero.tipodoi === "06" &&
                        this.tercero.numerodoi.length == 11
                    ) {
                        this.apimigoService
                            .consultarRUC(this.tercero.numerodoi)
                            .then((resp) => {
                                this.terceroForm.controls[
                                    "nombretercero"
                                ].setValue(resp.nombre_o_razon_social);
                                this.terceroForm.controls["direccion"].setValue(
                                    resp.direccion_simple
                                );
                                this.ubigeosService
                                    .getByCodigo(resp.ubigeo)
                                    .subscribe((ubigeo: UbigeoInterface) => {
                                        ubigeo.nombreUbigeo = `${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`;
                                        this.terceroForm.controls[
                                            "ubigeo"
                                        ].setValue(ubigeo);
                                        // this.ubigeosFiltrados.push(ubigeo);
                                        // console.log(this.ubigeosFiltrados)
                                    });
                            });
                    } else {
                        console.log("numero de doi inválido");
                    }
                } else {
                    this.messageService.add({
                        severity: "info",
                        summary: "Atención",
                        detail: "Ya existe un Cliente / Proveedor registrado con este DOI",
                        life: 3000,
                    });
                }
            });
    }

    exportToExcel() {
        this.tercerosService
            .getTerceros(
                this.currentPage,
                10000,
                this.sortField,
                this.sortOrder,
                this._filterPage
            )
            .subscribe((data) => {
                let dataToExcel: any[] = [];
                for (let row of data.data) {
                    let direcciones: string[] = [];
                    for (let dir of row.direcciones) {
                        direcciones.push(dir.direccion);
                    }
                    let dato = [
                        row.id,
                        row.numerodoi,
                        row.nombretercero,
                        row.correo,
                        row.telefono,
                        direcciones.join(" | "),
                    ];
                    dataToExcel.push(dato);
                }

                const archivoExcel: ArchivoExcelInterface = {
                    nombre: "clientes_proveedores",
                    hojas: [
                        {
                            nombre: "clientes_proveedores",
                            cabeceraHoja: {
                                logo: true,
                                titulo: "REPORTE DE CLIENTES / PROVEEDORES",
                                subtitulo: `Consultado a fecha: ${new Date().toISOString()}`,
                            },
                            cabecerasColumnas: [
                                "ID",
                                "NUMERO DOI",
                                "NOMBRE / RAZON SOCIAL",
                                "CORREO",
                                "TELEFONO",
                                "DIRECCION",
                            ],
                            anchoColumnas: [20, 20, 50, 50, 50, 50],
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
                            ],
                            dataColumnas: dataToExcel,
                        },
                    ],
                };
                this.excelService.dowloadExcel(archivoExcel);
            });
    }

    exportToPdf() {
        this.tercerosService
            .getTerceros(
                this.currentPage,
                10000,
                this.sortField,
                this.sortOrder,
                this._filterPage
            )
            .subscribe((data) => {
                let dataToTable: any[] = [];
                for (let row of data.data) {
                    let direcciones: string[] = [];
                    for (let dir of row.direcciones) {
                        direcciones.push(dir.direccion);
                    }
                    console.log(direcciones.toString());
                    let dato: CampoTable[] = [
                        {
                            value: row.id,
                            alignment: "center",
                        },
                        {
                            value: row.numerodoi,
                            alignment: "center",
                        },
                        {
                            value: row.nombretercero,
                            alignment: "left",
                        },
                        {
                            value: row.correo,
                            alignment: "left",
                        },
                        {
                            value: row.telefono,
                            alignment: "left",
                        },
                        {
                            value: direcciones.join(" | "),
                            alignment: "left",
                        },
                    ];
                    dataToTable.push(dato);
                }
                const archivoPdf: PdfTableInterface = {
                    layout: "", //'lightHorizontalLines',
                    table: {
                        headerRow: 1,
                        widths: [
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                        ],
                        body: {
                            headers: [
                                "ID",
                                "NUMERO DOI",
                                "NOMBRE / RAZON SOCIAL",
                                "CORREO",
                                "TELEFONO",
                                "DIRECCION",
                            ],
                            rows: dataToTable,
                        },
                    },
                };
                this.pdfService.exportToPdf(
                    archivoPdf,
                    "reporte_clientes_proveedores",
                    "REPORTE DE CLIENTES / PROVEEDORES",
                    "A4",
                    "landscape"
                );
            });
    }
}
