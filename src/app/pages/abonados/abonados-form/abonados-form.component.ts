import { Component } from "@angular/core";
import { AbonadoFormInterface, AbonadoInterface } from "../abonado.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TipoDoi } from "../../terceros/tercero.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { ApimigoService } from "src/app/compartidos/servicios/apimigo.service";
import { AbonadosService } from "../abonados.service";
import { UbigeosService } from "../../ubigeos/ubigeos.service";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { TercerosService } from "../../terceros/terceros.service";
import { UbigeoInterface } from "../../ubigeos/ubigeo.interface";
import { SectoresService } from "../../sectores/sectores.service";
import { SectorInterface } from "../../sectores/sector.interface";
import { ViasService } from "../../vias/vias.service";
import { ViaInterface } from "../../vias/via.interface";
import { PlanesService } from "../../planes/planes.service";
import { CajasnapService } from "../../cajasnap/cajasnap.service";
import { PlanInterface } from "../../planes/plan.interface";
import { CajanapInterface } from "../../cajasnap/cajanap.interface";
import { UsuarioService } from "../../usuarios/usuario.service";
import { UsuarioInterface } from "../../usuarios/usuario.interface";
import { OrdenAtencionInterface } from "../../ordenes-atenciones/orden-atencion.interface";
import { PdfService } from "src/app/compartidos/servicios/pdf.service";
import { PdfTableInterface } from "src/app/interfaces/pdf.interface";

@Component({
    selector: "app-abonados-form",
    templateUrl: "./abonados-form.component.html",
    styleUrls: ["./abonados-form.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class AbonadosFormComponent {
    abonado: AbonadoInterface = {};
    abonadoFormulario: AbonadoFormInterface = {};
    abonadoForm!: FormGroup;
    tiposDoi: TipoDoi[] | undefined;

    ubigeosFiltrados = [];
    sectores: SectorInterface[] = [];
    vias: ViaInterface[] = [];
    planes: PlanInterface[] = [];
    cajasnap: CajanapInterface[] = [];
    vendedores: UsuarioInterface[] = [];

    nuevoabonado = true;
    titulo = "";

    items: MenuItem[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private apimigoService: ApimigoService,
        private abonadosService: AbonadosService,
        private ubigeosService: UbigeosService,
        private sectoresService: SectoresService,
        private viasService: ViasService,
        private planesService: PlanesService,
        private cajasnapService: CajasnapService,
        private usuariosService: UsuarioService,
        private messageService: MessageService,
        private tercerosService: TercerosService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private pdfService: PdfService
    ) {
        this.loadAbonado();
        this.loadFormAbonado();
    }

    ngOnInit(): void {
        this.tiposDoi = [
            { tipo: "DNI", codigo: "01" },
            { tipo: "RUC", codigo: "06" },
        ];

        this.loadSectores();
        this.loadVias();
        this.loadPlanes();
        this.loadCajasNap();
        this.loadVendedores();
    }

    atenderOrdenAtencion(ordenAtencion: OrdenAtencionInterface) {}

    asignarOrdenAtencion(ordenAtencion: OrdenAtencionInterface) {}

    anularOrdenAtencion(ordenAtencion: OrdenAtencionInterface) {}

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

    loadFormAbonado() {
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

    loadAbonado() {
        this.activatedRoute.params.subscribe(
            (params) => {
                let id = params["id"];
                if (id) {
                    if (+id > 0) {
                        this.nuevoabonado = true;
                        this.abonadosService
                            .getAbonado(id)
                            .subscribe((res: any) => {
                                this.abonado = res.abonado as AbonadoInterface;

                                let direccion = res.direccion;
                                const { id, tercero, ...restAbonado } =
                                    this.abonado;
                                this.titulo = `${id} - ${tercero.nombretercero}`;
                                this.abonadoForm.controls["id"].setValue(id);
                                this.abonadoForm.controls["terceroId"].setValue(
                                    tercero.id
                                );
                                this.abonadoForm.controls["tipodoi"].setValue(
                                    tercero.tipodoi
                                );
                                this.abonadoForm.controls["numerodoi"].setValue(
                                    tercero.numerodoi
                                );
                                this.abonadoForm.controls[
                                    "nombretercero"
                                ].setValue(tercero.nombretercero);
                                this.abonadoForm.controls["correo"].setValue(
                                    tercero.correo
                                );
                                this.abonadoForm.controls["telefono"].setValue(
                                    tercero.telefono
                                );
                                this.abonadoForm.controls["direccion"].setValue(
                                    direccion.direccion
                                );
                                let ubigeo: UbigeoInterface = direccion.ubigeo;
                                ubigeo.nombreUbigeo = `${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`;
                                this.abonadoForm.controls["ubigeo"].setValue(
                                    ubigeo
                                );
                                this.abonadoForm.controls["plan"].setValue(
                                    this.abonado.plan.id
                                );
                                this.abonadoForm.controls["sector"].setValue(
                                    this.abonado.sector.id
                                );
                                this.abonadoForm.controls["via"].setValue(
                                    this.abonado.via.id
                                );
                                this.abonadoForm.controls["numero"].setValue(
                                    this.abonado.numero
                                );
                                this.abonadoForm.controls[
                                    "referencia"
                                ].setValue(this.abonado.referencia);
                                this.abonadoForm.controls["ont"].setValue(
                                    this.abonado.ont
                                );
                                this.abonadoForm.controls["latitud"].setValue(
                                    this.abonado.latitud
                                );
                                this.abonadoForm.controls["longitud"].setValue(
                                    this.abonado.longitud
                                );
                                this.abonadoForm.controls["cajanap"].setValue(
                                    this.abonado.cajanap.id
                                );
                                this.abonadoForm.controls["vendedor"].setValue(
                                    this.abonado.vendedor.id
                                );
                                this.abonadoForm.controls[
                                    "fecharegistro"
                                ].setValue(this.abonado.fecharegistro);
                                this.abonadoForm.controls[
                                    "fechaactivacion"
                                ].setValue(this.abonado.fechaactivacion);
                                this.abonadoForm.controls[
                                    "fechaultimaliquidacion"
                                ].setValue(this.abonado.fechaultimaliquidacion);
                                this.abonadoForm.controls["estado"].setValue(
                                    this.abonado.estado
                                );
                            });
                    } else {
                        this.nuevoabonado = false;
                        this.titulo = `${id} - Nuevo`;
                    }
                }
            },
            (err) => {
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: err,
                    life: 3000,
                });
            }
        );
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
                latitud: abonado.latitud,
                longitud: abonado.longitud,
                estado: abonado.estado,
                vendedorId: abonado.vendedor,
                fecharegistro: abonado.fecharegistro,
            };
            if (this.abonado.id > 0) {
                this.abonadosService.updateAbonado(datos).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: "Cliente / Proveedor actualizado correctamente",
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
                this.abonadosService.createAbonado(datos).subscribe({
                    next: () => {
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
        }
    }

    // hideDialog() {
    //     this.direccionDialog = false;
    //     this.areaDialog = false;
    // }

    toLista() {
        this.router.navigateByUrl("/admin/abonados");
    }

    ordenAtencionPdf(ordenAtencion: OrdenAtencionInterface) {
        this.pdfService.ordenAtencionPdf("orden-atencion");
        // });
    }
}
