import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {
    TerceroAreaInterface,
    TerceroDireccionInterface,
    TerceroInterface,
} from "./tercero.interface";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { TokenService } from "src/app/compartidos/servicios/token.service";
import { Observable, catchError, map, throwError } from "rxjs";
import { Links, Meta } from "src/app/interfaces";
import { checkToken } from "src/app/compartidos/interceptores/token.interceptor";

const api_url = environment.api_url;

@Injectable({
    providedIn: "root",
})
export class TercerosService {
    public tercero!: TerceroInterface;

    constructor(private http: HttpClient) {}

    getTerceros(
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
            .get<{ data: TerceroInterface[]; meta: Meta; links: Links }>(
                `${api_url}/terceros?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let terceros = response.data as TerceroInterface[];
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

    createTercero(tercero: TerceroInterface) {
        return this.http.post(`${api_url}/terceros`, tercero, {
            context: checkToken(),
        });
    }

    updateTercero(tercero: TerceroInterface) {
        return this.http.patch(`${api_url}/terceros/${tercero.id}`, tercero, {
            context: checkToken(),
        });
    }

    deleteTercero(id: number) {
        return this.http.delete(`${api_url}/terceros/${id}`, {
            context: checkToken(),
        });
    }

    autocompleteTercero(term: string): Observable<TerceroInterface[]> {
        return this.http
            .get<TerceroInterface[]>(
                `${api_url}/terceros/autocomplete/${term}`,
                {
                    context: checkToken(),
                }
            )
            .pipe(
                catchError((e) => {
                    console.error(e.error.mensaje);
                    return throwError(e);
                })
            );
    }

    getTercero(id: number): Observable<TerceroInterface> {
        return this.http.get<TerceroInterface>(`${api_url}/terceros/${id}`, {
            context: checkToken(),
        });
    }

    getByDoi(numerodoi: string) {
        return this.http.get(`${api_url}/terceros/doi/${numerodoi}`, {
            context: checkToken(),
        });
    }

    createDireccionTercero(direccion: TerceroDireccionInterface) {
        return this.http.post(`${api_url}/terceros/add-direccion`, direccion, {
            context: checkToken(),
        });
    }

    updateDireccionTercero(direccion: TerceroDireccionInterface) {
        return this.http.patch(
            `${api_url}/terceros/direccion/${direccion.id}`,
            direccion,
            {
                context: checkToken(),
            }
        );
    }

    deleteDireccionTercero(id: number) {
        return this.http.delete(`${api_url}/terceros/direccion/${id}`, {
            context: checkToken(),
        });
    }

    createAreaTercero(area: TerceroAreaInterface) {
        return this.http.post(`${api_url}/terceros/add-area`, area, {
            context: checkToken(),
        });
    }

    updateAreaTercero(area: TerceroAreaInterface) {
        return this.http.patch(`${api_url}/terceros/area/${area.id}`, area, {
            context: checkToken(),
        });
    }

    deleteAreaTercero(id: number) {
        return this.http.delete(`${api_url}/terceros/area/${id}`, {
            context: checkToken(),
        });
    }
}
