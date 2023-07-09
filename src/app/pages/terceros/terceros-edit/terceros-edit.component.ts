import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApimigoService } from "src/app/compartidos/servicios/apimigo.service";
import { TercerosService } from "../terceros.service";
import { UbigeosService } from "../../ubigeos/ubigeos.service";
import {
    TerceroAreaInterface,
    TerceroDireccionInterface,
    TerceroInterface,
    TipoDoi,
} from "../tercero.interface";
import { ConfirmationService, MessageService } from "primeng/api";
import { UbigeoInterface } from "../../ubigeos/ubigeo.interface";

@Component({
    selector: "app-terceros-edit",
    templateUrl: "./terceros-edit.component.html",
    styleUrls: ["./terceros-edit.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class TercerosEditComponent implements OnInit {
    tercero: TerceroInterface = {};
    terceroDireccion: TerceroDireccionInterface = {};
    terceroArea: TerceroAreaInterface = {};
    terceroForm!: FormGroup;
    direccionForm!: FormGroup;
    areaForm!: FormGroup;
    tiposDoi: TipoDoi[] | undefined;

    direccionDialog: boolean = false;
    deleteDireccionDialog: boolean = false;
    areaDialog: boolean = false;
    deleteAreaDialog: boolean = false;

    ubigeosFiltrados = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private apimigoService: ApimigoService,
        private tercerosService: TercerosService,
        private ubigeosService: UbigeosService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.loadFormTercero();
        this.loadFormDireccion();
        this.loadFormArea();
    }

    ngOnInit(): void {
        this.loadTercero();
        this.tiposDoi = [
            { tipo: "DNI", codigo: "01" },
            { tipo: "RUC", codigo: "06" },
        ];
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

    loadFormTercero() {
        this.terceroForm = this.fb.group({
            id: "0",
            tipodoi: ["", [Validators.required]],
            numerodoi: ["", [Validators.required]],
            nombretercero: ["", [Validators.required]],
            correo: [""],
            telefono: [""],
        });
    }

    loadFormDireccion() {
        this.direccionForm = this.fb.group({
            id:0,
            direccion: ["", [Validators.required]],
            ubigeo: ["", [Validators.required]],
        });
    }

    loadFormArea() {
        this.areaForm = this.fb.group({
            id: 0,
            area: ["", [Validators.required]],
        });
    }

    loadTercero() {
        this.activatedRoute.params.subscribe(
            (params) => {
                let id = params["id"];
                if (id) {
                    this.tercerosService.getTercero(id).subscribe((res) => {
                        this.tercero = res as TerceroInterface;
                        const { direcciones, areas, ...restTercero } =
                            this.tercero;
                        this.terceroForm.patchValue(restTercero);
                    });
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

    filtrarUbigeos(event: any) {
        this.ubigeosService
            .autocompleteUbigeo(event.query)
            .subscribe((result) => {
                this.ubigeosFiltrados = result;
            });
    }

    saveTercero() {
        if (this.terceroForm.invalid) {
            this.terceroForm.markAllAsTouched();
            return;
        } else {
            let tercero = {...this.terceroForm.value};
            let datos: any = {
                id: tercero.id,
                tipodoi: tercero.tipodoi,
                numerodoi: tercero.numerodoi,
                nombretercero: tercero.nombretercero,
                correo: tercero.correo,
                telefono: tercero.telefono,
            };
            if (this.tercero.id > 0) {
                this.tercerosService.updateTercero(datos).subscribe({
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
            }
        }
    }

    openNewDireccion() {
        this.terceroDireccion = { id: 0 };
        this.direccionDialog = true;
    }

    saveDireccion() {
        if (this.direccionForm.invalid) {
            this.direccionForm.markAllAsTouched();
            return;
        } else {
            this.terceroDireccion = {...this.direccionForm.value};
            let datos: any = {
                id: this.terceroDireccion.id,
                direccion: this.terceroDireccion.direccion,
                ubigeoId: this.terceroDireccion.ubigeo.id,
                terceroId: this.tercero.id,
            };
            if (this.terceroDireccion.id > 0) {
                this.tercerosService.updateDireccionTercero(datos).subscribe({
                    next: (direccion: TerceroDireccionInterface) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: "Dirección actualizado correctamente",
                            life: 3000,
                        });
                        this.direccionForm.reset();
                        this.direccionDialog = false;
                        console.log(direccion);
                        this.tercero.direcciones?.map((dato) => {
                            if (dato.id == direccion.id) {
                                dato.direccion = direccion.direccion;
                                dato.ubigeo = direccion.ubigeo;
                                dato.ubigeo.nombreUbigeo = `${direccion.ubigeo.distrito} - ${direccion.ubigeo.provincia} - ${direccion.ubigeo.departamento}`;
                            }
                            return dato;
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

                this.tercerosService.createDireccionTercero(datos).subscribe({
                    next: (direccion) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: "Dirección creada correctamente",
                            life: 3000,
                        });
                        this.tercero.direcciones?.push(direccion);
                        this.direccionForm.reset();
                        this.direccionDialog = false;
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

    openNewArea() {
        this.terceroArea = { id: 0 };
        this.areaDialog = true;
    }

    saveArea() {
        if (this.areaForm.invalid) {
            this.areaForm.markAllAsTouched();
            return;
        } else {
            this.terceroArea = {...this.areaForm.value};
            let datos: any = {
                id: this.terceroArea.id,
                area: this.terceroArea.area,
                terceroId: this.tercero.id,
            };
            if (this.terceroArea.id > 0) {
                this.tercerosService.updateAreaTercero(datos).subscribe({
                    next: (area: TerceroAreaInterface) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: "Área / Proyecto actualizado correctamente",
                            life: 3000,
                        });
                        this.areaForm.reset();
                        this.areaDialog = false;
                        this.tercero.areas?.map((dato) => {
                            if (dato.id == area.id) {
                                dato.area = area.area;
                            }
                            return dato;
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
                this.tercerosService.createAreaTercero(datos).subscribe({
                    next: (area) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: "Área / Proyecto creada correctamente",
                            life: 3000,
                        });
                        this.tercero.areas?.push(area);
                        this.areaForm.reset();
                        this.areaDialog = false;
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

    hideDialog() {
        this.direccionDialog = false;
        this.areaDialog = false;
    }

    editTerceroDireccion(terceroDireccion: TerceroDireccionInterface) {
        this.terceroDireccion = terceroDireccion;
        this.terceroDireccion.ubigeo.nombreUbigeo = `${this.terceroDireccion.ubigeo.distrito} - ${this.terceroDireccion.ubigeo.provincia} - ${this.terceroDireccion.ubigeo.departamento}`;
        this.direccionForm.patchValue(this.terceroDireccion);
        this.direccionDialog = true;
    }

    deleteTerceroDireccion(terceroDireccion: TerceroDireccionInterface) {
        this.deleteDireccionDialog = true;
        this.terceroDireccion = { ...terceroDireccion };
    }

    confirmDeleteDireccion() {
        this.deleteDireccionDialog = false;
        this.tercerosService
            .deleteDireccionTercero(this.terceroDireccion.id)
            .subscribe((resp) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Dirección eliminado con éxito",
                    life: 3000,
                });
                this.tercero.direcciones = this.tercero.direcciones.filter(val => val.id !== this.terceroDireccion.id);
                this.terceroDireccion = {};
            });
    }

    editTerceroArea(terceroArea: TerceroAreaInterface) {
        this.terceroArea = terceroArea;
        this.areaForm.patchValue(this.terceroArea);
        this.areaDialog = true;
    }

    deleteTerceroArea(terceroArea: TerceroAreaInterface) {
        this.deleteAreaDialog = true;
        this.terceroArea = { ...terceroArea };
    }

    confirmDeleteArea() {
        this.deleteAreaDialog = false;
        this.tercerosService
            .deleteAreaTercero(this.terceroArea.id)
            .subscribe((resp) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Área / Proyecto eliminado con éxito",
                    life: 3000,
                });
                this.tercero.areas = this.tercero.areas.filter(val => val.id !== this.terceroArea.id);
                this.terceroArea = {};
            });
    }

    toLista(){
        this.router.navigateByUrl("/admin/terceros");
    }
}
