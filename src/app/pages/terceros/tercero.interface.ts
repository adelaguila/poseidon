import { UbigeoInterface } from "../ubigeos/ubigeo.interface";

export interface TerceroDireccionInterface{
    id?: number;
    direccion?: string;
    ubigeo?: UbigeoInterface;
    tercero?: TerceroAreaInterface;
}

export interface TerceroAreaInterface{
    id?: number;
    area?: string;
    tercero?: TerceroInterface;
}

export interface TipoDoi {
    tipo: string;
    codigo: string;
}

export interface TerceroInterface {
    id?: number;
    tipodoi?: string;
    numerodoi?: string;
    nombretercero?: string;
    correo?: string;
    telefono?: string;
    direccion?: string;
    ubigeo?: UbigeoInterface;
    direcciones?: TerceroDireccionInterface[];
    areas?: TerceroAreaInterface[];
}
