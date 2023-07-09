import { CajanapInterface } from "../cajasnap/cajanap.interface";
import { PlanInterface } from "../planes/plan.interface";
import { SectorInterface } from "../sectores/sector.interface";
import { TerceroInterface } from "../terceros/tercero.interface";
import { ViaInterface } from "../vias/via.interface";

export interface AbonadoInterface {
    id?: number;
    tercero?: TerceroInterface;
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
}
