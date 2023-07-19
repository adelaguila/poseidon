import { AbonadoInterface } from "../abonados/abonado.interface";
import { TipoOrdenAtencionInterface } from "../tipos-ordenes-atenciones/tipo-orden-atencion.interface";
import { UsuarioInterface } from "../usuarios/usuario.interface";

export interface OrdenAtencionInterface {
    id?: number;
    fecharegistro?: string;
    tipoOrdenAtencion?: TipoOrdenAtencionInterface;
    abonado?: AbonadoInterface;
    tecnico?: UsuarioInterface;
    fechaasignacion?: string;
    fechaatencion?: string;
    reporte?: string;
    estado?: string;
}
