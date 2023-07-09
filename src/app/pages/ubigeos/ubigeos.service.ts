import { Injectable } from "@angular/core";
import { UbigeoInterface } from "./ubigeo.interface";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { TokenService } from "src/app/compartidos/servicios/token.service";
import { Observable, catchError, map, throwError } from "rxjs";
import { Links, Meta } from "src/app/interfaces";
import { environment } from "src/environments/environment";
import { checkToken } from "src/app/compartidos/interceptores/token.interceptor";

const api_url = environment.api_url;

@Injectable({
    providedIn: "root",
})
export class UbigeosService {
    public ubigeo!: UbigeoInterface;

    constructor(
        private http: HttpClient,
        private router: Router,
        private tokenService: TokenService
    ) {}

    getUbigeos(
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
            .get<{ data: UbigeoInterface[]; meta: Meta; links: Links }>(
                `${api_url}/ubigeos?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let ubigeos = response.data as UbigeoInterface[];
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

    createUbigeo(ubigeo: UbigeoInterface) {
        return this.http.post(`${api_url}/ubigeos`, ubigeo, {
            context: checkToken(),
        });
    }

    updateUbigeo(ubigeo: UbigeoInterface) {
        return this.http.patch(`${api_url}/ubigeos/${ubigeo.id}`, ubigeo, {
            context: checkToken(),
        });
    }

    deleteUbigeo(id: number) {
        return this.http.delete(`${api_url}/ubigeos/${id}`, {
            context: checkToken(),
        });
    }

    autocompleteUbigeo(term: string): Observable<UbigeoInterface[]> {
        return this.http
            .get<UbigeoInterface[]>(`${api_url}/ubigeos/autocomplete/${term}`, {
                context: checkToken(),
            })
            .pipe(
                map(response => {
                    return response.map(ubigeo =>{
                        ubigeo.nombreUbigeo = `${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`
                        return ubigeo;
                    });
                }),
                catchError((e) => {
                    console.error(e.error.mensaje);
                    return throwError(e);
                })
            );
    }

    getByCodigo(codigo: string): Observable<UbigeoInterface> {
        return this.http
            .get<UbigeoInterface>(`${api_url}/ubigeos/codigo/${codigo}`, {
                context: checkToken(),
            })
            .pipe(
                catchError((e) => {
                    console.error(e.error.mensaje);
                    return throwError(e);
                })
            );
    }
}
