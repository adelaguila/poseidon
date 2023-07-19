import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TipoOrdenAtencionInterface } from './tipo-orden-atencion.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Links, Meta } from 'src/app/interfaces';
import { checkToken } from 'src/app/compartidos/interceptores/token.interceptor';

const api_url = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class TiposOrdenesAtencionesService {

    public tipoOrdenAtencion!: TipoOrdenAtencionInterface;

    constructor(
        private http: HttpClient,
    ) {}

    getTipoOrdenAtenciones(
        page?: number,
        rows?: number,
        sortfield?: string,
        sortorder?: string,
        filtros?: any
    ): Observable<any> {
        const params = new HttpParams()
            .set("page", page)
            .set("limit", rows)
            .set("sortBy", `${sortfield}:${sortorder.toUpperCase()}`);

        return this.http
            .get<{ data: TipoOrdenAtencionInterface[]; meta: Meta; links: Links }>(
                `${api_url}/tipos-ordenes-atenciones?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let tiposOrdenesAtenciones = response.data as TipoOrdenAtencionInterface[];
                    return {
                        data: response.data,
                        meta: response.meta,
                        links: response.links,
                    };
                }),
                catchError((e) => {
                    console.error(e.error.mensaje);
                    return throwError(e);
                })
            );
    }

    getTipoOrdenAtencionesSelect(){
        return this.http.get(`${api_url}/tipos-ordenes-atenciones/lista`, {
            context: checkToken(),
        });
    }

    createTipoOrdenAtencion(tipoOrdenAtencion: TipoOrdenAtencionInterface) {
        return this.http.post(`${api_url}/tipos-ordenes-atenciones`, tipoOrdenAtencion, {
            context: checkToken(),
        });
    }

    updateTipoOrdenAtencion(tipoOrdenAtencion: TipoOrdenAtencionInterface) {
        return this.http.patch(`${api_url}/tipos-ordenes-atenciones/${tipoOrdenAtencion.id}`, tipoOrdenAtencion, {
            context: checkToken(),
        });
    }

    deleteTipoOrdenAtencion(id: number) {
        return this.http.delete(`${api_url}/tipos-ordenes-atenciones/${id}`, {
            context: checkToken(),
        });
    }

}
