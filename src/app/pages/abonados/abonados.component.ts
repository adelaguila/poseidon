import { Component, ViewChild } from "@angular/core";
import {
    ConfirmationService,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from "primeng/api";
import { Table } from "primeng/table";
import { AbonadoFormInterface, AbonadoInterface } from "./abonado.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AbonadosService } from "./abonados.service";
import { Util } from "src/app/utilities/util";
import { ExcelService } from "src/app/compartidos/servicios/excel.service";
import { PdfService } from "src/app/compartidos/servicios/pdf.service";
import { ArchivoExcelInterface } from "src/app/interfaces/excel.interface";
import {
    CampoTable,
    PdfTableInterface,
} from "src/app/interfaces/pdf.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { UbigeosService } from "../ubigeos/ubigeos.service";
import { ApimigoService } from "src/app/compartidos/servicios/apimigo.service";
import { TercerosService } from "../terceros/terceros.service";
import { UbigeoInterface } from "../ubigeos/ubigeo.interface";
import { SectorInterface } from "../sectores/sector.interface";
import { ViaInterface } from "../vias/via.interface";
import { PlanInterface } from "../planes/plan.interface";
import { CajanapInterface } from "../cajasnap/cajanap.interface";
import { UsuarioInterface } from "../usuarios/usuario.interface";
import { SectoresService } from "../sectores/sectores.service";
import { ViasService } from "../vias/vias.service";
import { CajasnapService } from "../cajasnap/cajasnap.service";
import { UsuarioService } from "../usuarios/usuario.service";
import { PlanesService } from "../planes/planes.service";
import { TipoDoi } from "../terceros/tercero.interface";
import {
    MATCHMODEOPTIONSNUMBER,
    MATCHMODEOPTIONSTEXT,
} from "src/app/compartidos/servicios/parametros-filtros-tabla";

@Component({
    selector: "app-abonados",
    templateUrl: "./abonados.component.html",
    styleUrls: ["./abonados.component.scss"],
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

    ubigeosFiltrados = [];
    sectores: SectorInterface[] = [];
    vias: ViaInterface[] = [];
    planes: PlanInterface[] = [];
    cajasnap: CajanapInterface[] = [];
    vendedores: UsuarioInterface[] = [];

    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];
    abonadoForm!: FormGroup;
    abonadoFormulario: AbonadoFormInterface = {};
    accionFrozen: boolean = true;
    tiposDoi: TipoDoi[] | undefined;
    estados!: any[];

    constructor(
        private abonadosService: AbonadosService,
        private tercerosService: TercerosService,
        private sectoresService: SectoresService,
        private viasService: ViasService,
        private cajasnapService: CajasnapService,
        private usuariosService: UsuarioService,
        private planesService: PlanesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private ubigeosService: UbigeosService,
        private apimigoService: ApimigoService
    ) {
        this.buildFormAbonado();
    }

    ngOnInit() {
        this.tiposDoi = [
            { tipo: "DNI", codigo: "01" },
            { tipo: "RUC", codigo: "06" },
        ];

        this.loadSectores();
        this.loadVias();
        this.loadPlanes();
        this.loadCajasNap();
        this.loadVendedores();

        this.cols = [
            { field: "id", header: "ID" },
            { field: "numerodoi", header: "Número DOI" },
            { field: "nombretercero", header: "Nombre del Abonado" },
            { field: "nombresector", header: "Sector" },
            { field: "nombrevia", header: "Vía" },
            { field: "numero", header: "Número" },
            { field: "referencia", header: "Referencia" },
            { field: "nombreplan", header: "Plan" },
            { field: "nombrecajanap", header: "Caja Nap" },
            { field: "fecharegistro", header: "F.Registro" },
            { field: "fechaactivacion", header: "F.Activacion" },
            { field: "fechaultimaliquidacion", header: "F.U.Liquidación" },
            { field: "estado", header: "Estado" },
        ];

        this.matchModeOptionsText = MATCHMODEOPTIONSTEXT;
        this.matchModeOptionsNumber = MATCHMODEOPTIONSNUMBER;

        this.estados = [
            { label: "Por Instalar", value: "REGISTRADO" },
            { label: "Activo", value: "ACTIVO" },
            { label: "Cortado Temporal", value: "CORTADO-TEMPORAL" },
            { label: "Cortado x Mora", value: "CORTADO-MORA" },
            { label: "Cortado a Solucitud", value: "CORTADO-SOLICITUD" },
        ];

        this.loading = true;
    }

    getSeverity(estado: string) {
        // console.log(estado);
        switch (estado) {
            case "Cortado x Mora":
                return "danger";
            case "Activo":
                return "success";
            case "Por Instalar":
                return "info";
            case "Cortado Temporal":
                return "warning";
            case "Cortado a Solucitud":
                return "secondary";
            default:
                return null;
        }
    }

    isValidField(form: FormGroup, field: string): boolean | null {
        return form.controls[field].errors && form.controls[field].touched;
    }

    getFieldError(form: FormGroup, field: string): string {
        if (!form.controls[field]) return null;

        const errors = form.controls[field].errors || {};

        for (const key of Object.keys(errors)) {
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
        let fecha = new Date();
        let desdeStr = `${fecha.getFullYear()}-${(
            "0" +
            (fecha.getMonth() + 1)
        ).slice(-2)}-${fecha.getDate()}`;
        this.abonadoForm = this.fb.group({
            id: 0,
            terceroId: 0,
            tipodoi: ["01", [Validators.required]],
            numerodoi: ["", [Validators.required]],
            nombretercero: ["", [Validators.required]],
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
            ont: [""],
            latitud: [""],
            longitud: [""],
            estado: ["REGISTRADO"],
            vendedor: ["", [Validators.required]],
            fecharegistro: [desdeStr],
            fechaactivacion: [Date],
            fechaultimaliquidacion: [Date],
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
                this.abonados.map((el) => {
                    el.vianumero = `${el.via.nombrevia} ${el.numero}`;
                })
            });
    }

    openNew() {
        this.abonado = {};
        this.submitted = false;
        this.abonadoDialog = true;
        // this.router.navigate(["formulario", 0], {
        //     relativeTo: this.route,
        // });
    }

    editAbonado(abonado: AbonadoInterface) {
        this.abonado = abonado;
        this.router.navigate(["formulario", abonado.id], {
            relativeTo: this.route,
        });
    }

    deleteAbonado(abonado: AbonadoInterface) {
        this.deleteAbonadoDialog = true;
        this.abonado = { ...abonado };
    }

    confirmDelete() {
        this.deleteAbonadoDialog = false;
        this.abonadosService
            .deleteAbonado(this.abonado.id)
            .subscribe((resp) => {
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

    buscarMigo() {
        this.abonadoFormulario = this.abonadoForm.value;
        if (
            this.abonadoFormulario.tipodoi == "01" &&
            this.abonadoFormulario.numerodoi.length != 8
        ) {
            this.messageService.add({
                severity: "info",
                summary: "Atención",
                detail: "Número de DNI inválido",
                life: 3000,
            });
            return;
        }
        if (
            this.abonadoFormulario.tipodoi == "06" &&
            this.abonadoFormulario.numerodoi.length != 11
        ) {
            this.messageService.add({
                severity: "info",
                summary: "Atención",
                detail: "Número de RUC inválido",
                life: 3000,
            });
            return;
        }
        this.tercerosService
            .getByDoi(this.abonadoFormulario.numerodoi)
            .subscribe((resp: any) => {
                if (resp.statusCode === 404) {
                    if (
                        this.abonadoFormulario.tipodoi == "01" &&
                        this.abonadoFormulario.numerodoi.length == 8
                    ) {
                        this.apimigoService
                            .consultarDNI(this.abonadoFormulario.numerodoi)
                            .then((resp) => {
                                this.abonadoForm.controls[
                                    "nombretercero"
                                ].setValue(resp.nombre);
                            });
                    } else if (
                        this.abonadoFormulario.tipodoi === "06" &&
                        this.abonadoFormulario.numerodoi.length == 11
                    ) {
                        this.apimigoService
                            .consultarRUC(this.abonadoFormulario.numerodoi)
                            .then((resp) => {
                                this.abonadoForm.controls[
                                    "nombretercero"
                                ].setValue(resp.nombre_o_razon_social);
                                this.abonadoForm.controls["direccion"].setValue(
                                    resp.direccion_simple
                                );
                                this.ubigeosService
                                    .getByCodigo(resp.ubigeo)
                                    .subscribe((ubigeo: UbigeoInterface) => {
                                        ubigeo.nombreUbigeo = `${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`;
                                        this.abonadoForm.controls[
                                            "ubigeo"
                                        ].setValue(ubigeo);
                                    });
                            });
                    } else {
                        console.log("numero de doi inválido");
                    }
                } else {
                    this.abonadoForm.controls["terceroId"].setValue(
                        resp.tercero.id
                    );
                    this.abonadoForm.controls["nombretercero"].setValue(
                        resp.tercero.nombretercero
                    );
                    this.abonadoForm.controls["direccion"].setValue(
                        resp.direccion.direccion
                    );
                    this.abonadoForm.controls["correo"].setValue(
                        resp.tercero.correo
                    );
                    this.abonadoForm.controls["telefono"].setValue(
                        resp.tercero.telefono
                    );
                    let ubigeo: UbigeoInterface = resp.direccion.ubigeo;
                    ubigeo.nombreUbigeo = `${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`;
                    this.abonadoForm.controls["ubigeo"].setValue(ubigeo);
                }
            });
    }

    filtrarUbigeos(event: any) {
        this.ubigeosService
            .autocompleteUbigeo(event.query)
            .subscribe((result) => {
                this.ubigeosFiltrados = result;
            });
    }

    loadSectores() {
        this.sectoresService
            .getSectoresSelect()
            .subscribe((result: SectorInterface[]) => {
                this.sectores = result;
            });
    }

    loadVias() {
        this.viasService.getViasSelect().subscribe((result: ViaInterface[]) => {
            this.vias = result;
        });
    }

    loadPlanes() {
        this.planesService
            .getPlanesSelect()
            .subscribe((result: PlanInterface[]) => {
                this.planes = result;
            });
    }

    loadCajasNap() {
        this.cajasnapService
            .getCajasnapSelect()
            .subscribe((result: CajanapInterface[]) => {
                this.cajasnap = result;
            });
    }

    loadVendedores() {
        this.usuariosService
            .getUsuariosSelect()
            .subscribe((result: UsuarioInterface[]) => {
                this.vendedores = result;
            });
    }

    saveAbonado() {
        if (this.abonadoForm.invalid) {
            this.abonadoForm.markAllAsTouched();
            return;
        } else {
            let abonado = { ...this.abonadoForm.value };
            console.log(abonado);
            let datos: any = {
                id: abonado.id,
                terceroId: abonado.terceroId,
                tipodoi: abonado.tipodoi,
                numerodoi: abonado.numerodoi,
                nombretercero: abonado.nombretercero,
                direccion: abonado.direccion,
                ubigeoId: abonado.ubigeo.id,
                correo: abonado.correo,
                telefono: abonado.telefono,
                sectorId: abonado.sector,
                viaId: abonado.via,
                numero: abonado.numero,
                referencia: abonado.referencia,
                planId: abonado.plan,
                cajanapId: abonado.cajanap,
                ont: abonado.ont,
                latitud: 0,
                longitud: 0,
                estado: "REGISTRADO",
                vendedorId: abonado.vendedor,
                fecharegistro: abonado.fecharegistro,
            };

            this.abonadosService.createAbonado(datos).subscribe({
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

            this.abonadoDialog = false;
            this.abonadoForm.reset();
            this.abonado = {};
            // }
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
                            anchoColumnas: [
                                20, 40, 60, 50, 50, 40, 50, 50, 50, 20,
                            ],
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
                        widths: [
                            50,
                            "auto",
                            "auto",
                            "auto",
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
                    "landscape"
                );
            });
    }
}
