import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, catchError, map, of, tap, throwError } from "rxjs";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment";
import { Usuario } from "./usuario.model";
import { TokenService } from "src/app/compartidos/servicios/token.service";
import { Links, Meta, RegisterForm } from "src/app/interfaces";
import { checkToken } from "src/app/compartidos/interceptores/token.interceptor";

const api_url = environment.api_url;

@Injectable({
    providedIn: "root",
})
export class UsuarioService {
    public usuario!: Usuario;

    constructor(
        private http: HttpClient,
        private router: Router,
        private tokenService: TokenService
    ) {}

    registrarUsuario(formData: RegisterForm) {
        return this.http.post(`${api_url}/auth/register`, formData).pipe(
            tap((resp: any) => {
                this.tokenService.guardarToken(resp.token);
            })
        );
    }

    actualizarPerfil(data: { email: string; fullName: string }) {
        return this.http.patch(`${api_url}/auth/`, data, {
            context: checkToken(),
        });
    }

    getPagination(
        pagenumber: number,
        rows: number,
        sortdireccion: string,
        sortcolumn: string,
        filters: any
    ): Observable<any> {
        const params = new HttpParams()
            .set("page", pagenumber + 1)
            .set("limit", rows)
            .set("sortBy", `${sortcolumn}:${sortdireccion.toUpperCase()}`);

        return this.http
            .get<{ data: Usuario[]; meta: Meta; links: Links }>(
                `${api_url}/auth/usuarios?${filters}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let usuarios = response.data as Usuario[];
                    return {
                        data: usuarios.map((usuario) => {
                            if (usuario.image == null) {
                                usuario.image = `${api_url}/files/user/default.jpg`;
                            } else {
                                usuario.image = `${api_url}/files/user/${usuario.image}`;
                            }
                            return usuario;
                        }),
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

    getUsuarios(
        parametros?: any,
        page?: number,
        filtros?: any
    ): Observable<any> {
        const params = new HttpParams()
            .set("page", page)
            .set("limit", parametros.rows);

        return this.http
            .get<{ data: Usuario[]; meta: Meta; links: Links }>(
                `${api_url}/auth/usuarios?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let usuarios = response.data as Usuario[];
                    return {
                        data: usuarios.map((usuario) => {
                            if (usuario.image == null) {
                                usuario.image = `${api_url}/files/user/default.jpg`;
                            } else {
                                usuario.image = `${api_url}/files/user/${usuario.image}`;
                            }
                            return usuario;
                        }),
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

    getUsuariosSelect() {
        return this.http.get(`${api_url}/auth/usuarios/lista`, {
            context: checkToken(),
        });
    }

    cambiarEstado(usuario: Usuario) {
        return this.http.patch(
            `${api_url}/auth/cambiar-estado/${usuario.id}`,
            "",
            { context: checkToken() }
        );
    }

    cambiarRole(usuario: Usuario) {
        let id = usuario.id;
        delete usuario.id;

        return this.http.patch(`${api_url}/auth/cambiar-role/${id}`, usuario, {
            context: checkToken(),
        });
    }
}
