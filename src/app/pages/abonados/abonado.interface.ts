import { CajanapInterface } from "../cajasnap/cajanap.interface";
import { OrdenAtencionInterface } from "../ordenes-atenciones/orden-atencion.interface";
import { PlanInterface } from "../planes/plan.interface";
import { SectorInterface } from "../sectores/sector.interface";
import { TerceroInterface } from "../terceros/tercero.interface";
import { UbigeoInterface } from "../ubigeos/ubigeo.interface";
import { UsuarioInterface } from "../usuarios/usuario.interface";
import { ViaInterface } from "../vias/via.interface";

export interface AbonadoInterface {
    id?: number;
    tercero?: TerceroInterface;
    sector?: SectorInterface;
    via?: ViaInterface;
    numero?: string;
    vianumero?: string;
    referencia?: string;
    plan?: PlanInterface;
    cajanap?: CajanapInterface;
    vendedor?: UsuarioInterface;
    fecharegistro?: string;
    fechaactivacion?: string;
    fechaultimaliquidacion?: string;
    ont?: string;
    latitud?: number;
    longitud?: number;
    imagen?: number;
    estado?: string;
    ordenesAtenciones?: OrdenAtencionInterface[];
}

export interface AbonadoFormInterface {
    id?: number;
    tipodoi?: string;
    numerodoi?: string;
    nombretercero?: string;
    correo?: string;
    telefono?: string;
    direccion?: string;
    ubigeo?: UbigeoInterface;
    sector?: SectorInterface;
    via?: ViaInterface;
    numero?: string;
    referencia?: string;
    plan?: PlanInterface;
    cajanap?: CajanapInterface;
    fecharegistro?: string;
    fechaactivacion?: string;
    fechaultimaliquidacion?: string;
    ont?: string;
    latitud?: number;
    longitud?: number;
    imagen?: number;
    estado?: string;
    vendedor?: UsuarioInterface;
    ordenesAtenciones?: OrdenAtencionInterface[];
}
